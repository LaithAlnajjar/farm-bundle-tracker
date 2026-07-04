export interface TokenVerifier {
  verify(token: string): { userId: number; email: string };
}
