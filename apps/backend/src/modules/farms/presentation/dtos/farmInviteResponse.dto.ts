export type FarmInviteResponseDto = {
  id: number;
  createdByUserId: number;
  creatorUsername: string;
  expiresAt: string;
  revokedAt: string | null;
  createdAt: string;
  status: 'active' | 'expired' | 'revoked';
};

export type CreatedFarmInviteResponseDto = FarmInviteResponseDto & {
  token: string;
};

export type FarmInvitePreviewResponseDto = {
  farmName: string;
  expiresAt: string;
};
