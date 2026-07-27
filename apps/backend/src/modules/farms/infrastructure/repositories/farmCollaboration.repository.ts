import { Injectable } from '@nestjs/common';
import { and, asc, desc, eq, gt, isNull, ne } from 'drizzle-orm';
import { InjectDb } from '@/infrastructure/database/drizzle/drizzle.provider';
import type { DBClient } from '@/infrastructure/database/drizzle/db';
import { users } from '@/modules/users/infrastructure/persistence/drizzle/users.schema';
import { Farm } from '../../domain/entities/farm';
import { FarmInvite } from '../../domain/entities/farmInvite';
import { FarmMembership } from '../../domain/entities/farmMembership';
import type {
  FarmCollaborationRepository,
  InviteLookup,
} from '../../domain/repositories/farmCollaboration.repository';
import type { FarmRole } from '../../domain/entities/farm';
import {
  farmInvites,
  farmItemClaims,
  farmMemberships,
  farms,
} from '../persistence/drizzle/farms.schema';

const membershipSelection = {
  id: farmMemberships.id,
  farmId: farmMemberships.farmId,
  userId: farmMemberships.userId,
  username: users.username,
  email: users.email,
  role: farmMemberships.role,
  joinedAt: farmMemberships.joinedAt,
  updatedAt: farmMemberships.updatedAt,
};

const inviteSelection = {
  id: farmInvites.id,
  farmId: farmInvites.farmId,
  createdByUserId: farmInvites.createdByUserId,
  creatorUsername: users.username,
  expiresAt: farmInvites.expiresAt,
  revokedAt: farmInvites.revokedAt,
  createdAt: farmInvites.createdAt,
};

type MembershipRow = {
  id: number;
  farmId: number;
  userId: number;
  username: string;
  email: string;
  role: FarmRole;
  joinedAt: Date;
  updatedAt: Date;
};

type InviteRow = {
  id: number;
  farmId: number;
  createdByUserId: number;
  creatorUsername: string;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
};

@Injectable()
export class DrizzleFarmCollaborationRepository implements FarmCollaborationRepository {
  constructor(@InjectDb() private readonly db: DBClient) {}

  async findMembership(farmId: number, userId: number) {
    const [row] = await this.db
      .select(membershipSelection)
      .from(farmMemberships)
      .innerJoin(users, eq(users.id, farmMemberships.userId))
      .innerJoin(farms, eq(farms.id, farmMemberships.farmId))
      .where(
        and(
          eq(farmMemberships.farmId, farmId),
          eq(farmMemberships.userId, userId),
          isNull(farms.deletedAt),
        ),
      );
    return row ? this.toMembership(row) : null;
  }

  async findMembershipById(
    farmId: number,
    membershipId: number,
  ): Promise<FarmMembership | null> {
    const [row] = await this.db
      .select(membershipSelection)
      .from(farmMemberships)
      .innerJoin(users, eq(users.id, farmMemberships.userId))
      .where(
        and(
          eq(farmMemberships.farmId, farmId),
          eq(farmMemberships.id, membershipId),
        ),
      );
    return row ? this.toMembership(row) : null;
  }

  async listMembers(farmId: number): Promise<FarmMembership[]> {
    const rows = await this.db
      .select(membershipSelection)
      .from(farmMemberships)
      .innerJoin(users, eq(users.id, farmMemberships.userId))
      .where(eq(farmMemberships.farmId, farmId))
      .orderBy(asc(farmMemberships.joinedAt), asc(farmMemberships.id));
    return rows.map((row) => this.toMembership(row));
  }

  async addMember(
    farmId: number,
    userId: number,
    role: Exclude<FarmRole, 'owner'>,
  ): Promise<FarmMembership | null> {
    const [inserted] = await this.db
      .insert(farmMemberships)
      .values({ farmId, userId, role })
      .onConflictDoNothing({
        target: [farmMemberships.farmId, farmMemberships.userId],
      })
      .returning({ id: farmMemberships.id });
    return inserted ? this.findMembershipById(farmId, inserted.id) : null;
  }

  async changeMemberRole(
    farmId: number,
    membershipId: number,
    role: Exclude<FarmRole, 'owner'>,
  ): Promise<FarmMembership | null> {
    const updatedId = await this.db.transaction(async (tx) => {
      await tx
        .select({ id: farms.id })
        .from(farms)
        .where(eq(farms.id, farmId))
        .for('update');
      const [updated] = await tx
        .update(farmMemberships)
        .set({ role, updatedAt: new Date() })
        .where(
          and(
            eq(farmMemberships.id, membershipId),
            eq(farmMemberships.farmId, farmId),
            ne(farmMemberships.role, 'owner'),
          ),
        )
        .returning({ id: farmMemberships.id });
      if (!updated) return null;
      if (role === 'viewer') {
        await tx
          .delete(farmItemClaims)
          .where(eq(farmItemClaims.claimantMembershipId, updated.id));
      }
      return updated.id;
    });
    return updatedId ? this.findMembershipById(farmId, updatedId) : null;
  }

  async transferOwnership(
    farmId: number,
    ownerUserId: number,
    targetMembershipId: number,
  ): Promise<FarmMembership | null> {
    const targetId = await this.db.transaction(async (tx) => {
      const memberships = await tx
        .select({
          id: farmMemberships.id,
          userId: farmMemberships.userId,
          role: farmMemberships.role,
        })
        .from(farmMemberships)
        .where(eq(farmMemberships.farmId, farmId))
        .for('update');
      const owner = memberships.find(
        (membership) =>
          membership.userId === ownerUserId && membership.role === 'owner',
      );
      const target = memberships.find(
        (membership) => membership.id === targetMembershipId,
      );
      if (!owner || !target || target.id === owner.id) return null;

      const now = new Date();
      await tx
        .update(farmMemberships)
        .set({ role: 'editor', updatedAt: now })
        .where(eq(farmMemberships.id, owner.id));
      await tx
        .update(farmMemberships)
        .set({ role: 'owner', updatedAt: now })
        .where(eq(farmMemberships.id, target.id));
      return target.id;
    });
    return targetId ? this.findMembershipById(farmId, targetId) : null;
  }

  async removeMember(farmId: number, membershipId: number): Promise<boolean> {
    const [deleted] = await this.db
      .delete(farmMemberships)
      .where(
        and(
          eq(farmMemberships.id, membershipId),
          eq(farmMemberships.farmId, farmId),
          ne(farmMemberships.role, 'owner'),
        ),
      )
      .returning({ id: farmMemberships.id });
    return Boolean(deleted);
  }

  async leaveFarm(farmId: number, userId: number): Promise<boolean> {
    const [deleted] = await this.db
      .delete(farmMemberships)
      .where(
        and(
          eq(farmMemberships.farmId, farmId),
          eq(farmMemberships.userId, userId),
          ne(farmMemberships.role, 'owner'),
        ),
      )
      .returning({ id: farmMemberships.id });
    return Boolean(deleted);
  }

  async createInvite(data: {
    farmId: number;
    createdByUserId: number;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<FarmInvite> {
    const [inserted] = await this.db
      .insert(farmInvites)
      .values(data)
      .returning({ id: farmInvites.id });
    if (!inserted) throw new Error('Failed to create farm invite');
    const invite = await this.findInviteById(inserted.id);
    if (!invite) throw new Error('Failed to load created farm invite');
    return invite;
  }

  async listInvites(farmId: number): Promise<FarmInvite[]> {
    const rows = await this.db
      .select(inviteSelection)
      .from(farmInvites)
      .innerJoin(users, eq(users.id, farmInvites.createdByUserId))
      .where(eq(farmInvites.farmId, farmId))
      .orderBy(desc(farmInvites.createdAt), desc(farmInvites.id));
    return rows.map((row) => this.toInvite(row));
  }

  async revokeInvite(farmId: number, inviteId: number): Promise<boolean> {
    const [updated] = await this.db
      .update(farmInvites)
      .set({ revokedAt: new Date() })
      .where(
        and(
          eq(farmInvites.id, inviteId),
          eq(farmInvites.farmId, farmId),
          isNull(farmInvites.revokedAt),
        ),
      )
      .returning({ id: farmInvites.id });
    return Boolean(updated);
  }

  async findInviteByTokenHash(tokenHash: string): Promise<InviteLookup | null> {
    const [row] = await this.db
      .select({ ...inviteSelection, farmName: farms.name })
      .from(farmInvites)
      .innerJoin(users, eq(users.id, farmInvites.createdByUserId))
      .innerJoin(farms, eq(farms.id, farmInvites.farmId))
      .where(
        and(eq(farmInvites.tokenHash, tokenHash), isNull(farms.deletedAt)),
      );
    return row ? { invite: this.toInvite(row), farmName: row.farmName } : null;
  }

  async redeemInvite(
    tokenHash: string,
    userId: number,
    now: Date,
  ): Promise<Farm | null> {
    return this.db.transaction(async (tx) => {
      const [invite] = await tx
        .select({ farmId: farmInvites.farmId })
        .from(farmInvites)
        .innerJoin(farms, eq(farms.id, farmInvites.farmId))
        .where(
          and(
            eq(farmInvites.tokenHash, tokenHash),
            isNull(farmInvites.revokedAt),
            gt(farmInvites.expiresAt, now),
            isNull(farms.deletedAt),
          ),
        )
        .for('update');
      if (!invite) return null;

      await tx
        .insert(farmMemberships)
        .values({ farmId: invite.farmId, userId, role: 'editor' })
        .onConflictDoNothing({
          target: [farmMemberships.farmId, farmMemberships.userId],
        });

      const [row] = await tx
        .select({
          id: farms.id,
          name: farms.name,
          catalogVersionId: farms.catalogVersionId,
          currentSeason: farms.currentSeason,
          ownerUserId: farmMemberships.userId,
          createdAt: farms.createdAt,
          updatedAt: farms.updatedAt,
          deletedAt: farms.deletedAt,
        })
        .from(farms)
        .innerJoin(
          farmMemberships,
          and(
            eq(farmMemberships.farmId, farms.id),
            eq(farmMemberships.role, 'owner'),
          ),
        )
        .where(eq(farms.id, invite.farmId));
      if (!row) throw new Error('Invited farm has no owner');
      const [currentMembership] = await tx
        .select({ role: farmMemberships.role })
        .from(farmMemberships)
        .where(
          and(
            eq(farmMemberships.farmId, invite.farmId),
            eq(farmMemberships.userId, userId),
          ),
        );
      if (!currentMembership)
        throw new Error('Failed to create invited farm membership');
      return new Farm(
        row.id,
        row.name,
        row.ownerUserId,
        row.catalogVersionId,
        row.currentSeason,
        row.createdAt,
        row.updatedAt,
        row.deletedAt,
        currentMembership.role,
      );
    });
  }

  private async findInviteById(id: number): Promise<FarmInvite | null> {
    const [row] = await this.db
      .select(inviteSelection)
      .from(farmInvites)
      .innerJoin(users, eq(users.id, farmInvites.createdByUserId))
      .where(eq(farmInvites.id, id));
    return row ? this.toInvite(row) : null;
  }

  private toMembership(row: MembershipRow): FarmMembership {
    return new FarmMembership(
      row.id,
      row.farmId,
      row.userId,
      row.username,
      row.email,
      row.role,
      row.joinedAt,
      row.updatedAt,
    );
  }

  private toInvite(row: InviteRow): FarmInvite {
    return new FarmInvite(
      row.id,
      row.farmId,
      row.createdByUserId,
      row.creatorUsername,
      row.expiresAt,
      row.revokedAt,
      row.createdAt,
    );
  }
}
