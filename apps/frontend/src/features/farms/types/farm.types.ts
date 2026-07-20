export type FarmRole = "owner" | "editor" | "viewer";

export interface Farm {
  id: number;
  name: string;
  userId: number;
  membershipRole: FarmRole;
  createdAt: string;
  updatedAt: string;
}

export interface FarmMember {
  id: number;
  userId: number;
  username: string;
  email: string;
  role: FarmRole;
  joinedAt: string;
}

export interface FarmInvite {
  id: number;
  createdByUserId: number;
  creatorUsername: string;
  expiresAt: string;
  revokedAt: string | null;
  createdAt: string;
  status: "active" | "expired" | "revoked";
}

export interface CreatedFarmInvite extends FarmInvite {
  token: string;
}

export interface FarmInvitePreview {
  farmName: string;
  expiresAt: string;
}
