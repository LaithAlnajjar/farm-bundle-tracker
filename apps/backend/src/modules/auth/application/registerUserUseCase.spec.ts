import { ConflictException } from '@nestjs/common';
import { RegisterUserUseCase } from './registerUserUseCase';
import type { PasswordHasher } from '../domain/interfaces/passwordHasher';
import type { UserRepository } from '@/modules/users/domain/repositories/user.repository';

describe('RegisterUserUseCase', () => {
  let registerUserUseCase: RegisterUserUseCase;
  let create: jest.MockedFunction<UserRepository['create']>;
  let findByEmail: jest.MockedFunction<UserRepository['findByEmail']>;
  let findByUsername: jest.MockedFunction<UserRepository['findByUsername']>;
  let hash: jest.MockedFunction<PasswordHasher['hash']>;

  beforeEach(() => {
    create = jest.fn();
    findByEmail = jest.fn();
    findByUsername = jest.fn();
    hash = jest.fn();

    const userRepository: UserRepository = {
      create,
      findByEmail,
      findByUsername,
      findById: jest.fn(),
    };
    const passwordHasher: PasswordHasher = {
      hash,
      compare: jest.fn(),
    };

    registerUserUseCase = new RegisterUserUseCase(
      userRepository,
      passwordHasher,
    );
  });

  it('registers a user with normalized details and a hashed password', async () => {
    findByEmail.mockResolvedValue(null);
    findByUsername.mockResolvedValue(null);
    hash.mockResolvedValue('hashed-password');

    await expect(
      registerUserUseCase.execute({
        email: '  USER@Example.COM  ',
        username: '  TestUser  ',
        password: 'password',
      }),
    ).resolves.toEqual({
      email: 'user@example.com',
      username: 'testuser',
    });

    expect(findByEmail).toHaveBeenCalledWith('user@example.com');
    expect(findByUsername).toHaveBeenCalledWith('testuser');
    expect(hash).toHaveBeenCalledWith('password');
    expect(create).toHaveBeenCalledWith({
      email: 'user@example.com',
      username: 'testuser',
      hashedPassword: 'hashed-password',
    });
    expect(create).toHaveBeenCalledTimes(1);
  });

  it('throws ConflictException when the email is already registered', async () => {
    const mockDate = new Date();
    findByEmail.mockResolvedValue({
      id: 1,
      email: 'user@example.com',
      username: 'existing-user',
      hashedPassword: 'hashed-password',
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    await expect(
      registerUserUseCase.execute({
        email: 'USER@example.com',
        username: 'new-user',
        password: 'password',
      }),
    ).rejects.toThrow(ConflictException);

    expect(findByEmail).toHaveBeenCalledWith('user@example.com');
    expect(findByUsername).not.toHaveBeenCalled();
    expect(hash).not.toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
  });

  it('throws ConflictException when the username is already registered', async () => {
    const mockDate = new Date();
    findByEmail.mockResolvedValue(null);
    findByUsername.mockResolvedValue({
      id: 1,
      email: 'existing@example.com',
      username: 'testuser',
      hashedPassword: 'hashed-password',
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    await expect(
      registerUserUseCase.execute({
        email: 'new@example.com',
        username: 'TestUser',
        password: 'password',
      }),
    ).rejects.toThrow(ConflictException);

    expect(findByUsername).toHaveBeenCalledWith('testuser');
    expect(hash).not.toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
  });
});
