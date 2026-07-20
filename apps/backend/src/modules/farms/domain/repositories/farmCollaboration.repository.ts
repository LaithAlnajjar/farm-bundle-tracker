import type { Farm } from '../entities/farm';
import type { FarmInvite } from '../entities/farmInvite';
import type { FarmMembership } from '../entities/farmMembership';
import type { FarmRole } from '../entities/farm';

export type InviteLookup = {
  invite: FarmInvite;
  farmName: string;
};

export interface FarmCollaborationRepository {
  findMembership(
    farmId: number,
    userId: number,
  ): Promise<FarmMembership | null>;
  findMembershipById(
    farmId: number,
    membershipId: number,
  ): Promise<FarmMembership | null>;
  listMembers(farmId: number): Promise<FarmMembership[]>;
  addMember(
    farmId: number,
    userId: number,
    role: Exclude<FarmRole, 'owner'>,
  ): Promise<FarmMembership | null>;
  changeMemberRole(
    farmId: number,
    membershipId: number,
    role: Exclude<FarmRole, 'owner'>,
  ): Promise<FarmMembership | null>;
  transferOwnership(
    farmId: number,
    ownerUserId: number,
    targetMembershipId: number,
  ): Promise<FarmMembership | null>;
  removeMember(farmId: number, membershipId: number): Promise<boolean>;
  leaveFarm(farmId: number, userId: number): Promise<boolean>;
  createInvite(data: {
    farmId: number;
    createdByUserId: number;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<FarmInvite>;
  listInvites(farmId: number): Promise<FarmInvite[]>;
  revokeInvite(farmId: number, inviteId: number): Promise<boolean>;
  findInviteByTokenHash(tokenHash: string): Promise<InviteLookup | null>;
  redeemInvite(
    tokenHash: string,
    userId: number,
    now: Date,
  ): Promise<Farm | null>;
}
