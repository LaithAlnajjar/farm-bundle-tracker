import { VerifyTokenUseCase } from './verifyTokenUseCase';
import type { TokenVerifier } from '../domain/interfaces/tokenVerifier';

describe('VerifyTokenUseCase', () => {
  let verifyTokenUseCase: VerifyTokenUseCase;
  let verify: jest.MockedFunction<TokenVerifier['verify']>;

  beforeEach(() => {
    verify = jest.fn();

    const tokenVerifier: TokenVerifier = { verify };
    verifyTokenUseCase = new VerifyTokenUseCase(tokenVerifier);
  });

  it('verifies the token and returns its user details', async () => {
    verify.mockReturnValue({ userId: 1, email: 'user@example.com' });

    await expect(verifyTokenUseCase.execute('access-token')).resolves.toEqual({
      userId: 1,
      email: 'user@example.com',
    });

    expect(verify).toHaveBeenCalledWith('access-token');
    expect(verify).toHaveBeenCalledTimes(1);
  });
});
