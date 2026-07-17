import { RefreshToken } from './refreshToken';

describe('refreshToken', () => {
  it('should return true when the token is expired', () => {
    const pastDate = new Date();
    pastDate.setFullYear(pastDate.getFullYear() - 1);

    const token = new RefreshToken(
      1,
      1,
      'string',
      new Date(),
      null,
      null,
      new Date(),
    );
    expect(token.isExpired(new Date())).toBe(true);
  });
});
