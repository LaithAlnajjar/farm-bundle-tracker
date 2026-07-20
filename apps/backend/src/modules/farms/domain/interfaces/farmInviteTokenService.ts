export interface FarmInviteTokenService {
  generate(): { token: string; hash: string };
  hash(token: string): string;
}
