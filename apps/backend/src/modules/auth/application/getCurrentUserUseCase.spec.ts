import { GetCurrentUserUseCase } from './getCurrentUserUseCase';
import { InvalidAccessTokenError } from '../domain/errors/invalidAccessToken.error';
import type { UserRepository } from '@/modules/users/domain/repositories/user.repository';

describe('GetCurrentUserUseCase', () => {
  let getCurrentUserUseCase: GetCurrentUserUseCase;
  let findById: jest.MockedFunction<UserRepository['findById']>;

  beforeEach(() => {
    findById = jest.fn();

    const userRepository: UserRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      findById,
    };

    getCurrentUserUseCase = new GetCurrentUserUseCase(userRepository);
  });

  it('returns the current user', async () => {
    const mockDate = new Date();
    findById.mockResolvedValue({
      id: 1,
      email: 'user@example.com',
      username: 'user',
      hashedPassword: 'hashed-password',
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    await expect(getCurrentUserUseCase.execute(1)).resolves.toEqual({
      id: 1,
      email: 'user@example.com',
      username: 'user',
    });

    expect(findById).toHaveBeenCalledWith(1);
    expect(findById).toHaveBeenCalledTimes(1);
  });

  it('throws InvalidAccessTokenError when the user does not exist', async () => {
    findById.mockResolvedValue(null);

    await expect(getCurrentUserUseCase.execute(1)).rejects.toThrow(
      InvalidAccessTokenError,
    );

    expect(findById).toHaveBeenCalledWith(1);
    expect(findById).toHaveBeenCalledTimes(1);
  });
});
