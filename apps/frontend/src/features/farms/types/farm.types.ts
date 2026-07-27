export type FarmRole = "owner" | "editor" | "viewer";
export type FarmSeason = "spring" | "summer" | "fall" | "winter";

export interface Farm {
  id: number;
  name: string;
  userId: number;
  catalogVersionId: number;
  currentSeason: FarmSeason;
  membershipRole: FarmRole;
  createdAt: string;
  updatedAt: string;
}

export interface FarmListItem extends Farm {
  summary: {
    progress: {
      completed: number;
      total: number;
      percentage: number;
      complete: boolean;
    };
    currentSeasonNeededItems: number;
    currentSeasonUnclaimedItems: number;
    myActiveClaims: number;
  };
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
