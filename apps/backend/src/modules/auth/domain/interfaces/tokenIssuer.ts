export interface TokenIssuer {
  issue(payload: { userId: number; email: string }): string;
}
