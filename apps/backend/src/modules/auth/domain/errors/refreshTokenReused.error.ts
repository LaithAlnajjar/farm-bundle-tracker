export class RefreshTokenReusedError extends Error {
  constructor() {
    super('Refresh token reused');
    this.name = 'RefreshTokenReusedError';
  }
}
