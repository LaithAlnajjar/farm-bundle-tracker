import { BadRequestException } from '@nestjs/common';
import { CreateFarmUseCase } from './createFarmUseCase';
import type { FarmRepository } from '../domain/repositories/farm.repository';

describe('CreateFarmUseCase', () => {
  let createFarmUseCase: CreateFarmUseCase;
  let create: jest.MockedFunction<FarmRepository['create']>;

  beforeEach(() => {
    create = jest.fn();

    const farmRepository: FarmRepository = {
      create,
      findByIdForUser: jest.fn(),
      listByUserId: jest.fn(),
      updateName: jest.fn(),
      softDelete: jest.fn(),
    };

    createFarmUseCase = new CreateFarmUseCase(farmRepository);
  });

  it('creates a farm belonging to the user', async () => {
    const mockDate = new Date();
    const mockFarm = {
      id: 1,
      name: 'test',
      userId: 1,
      createdAt: mockDate,
      updatedAt: mockDate,
      deletedAt: null,
    };

    create.mockResolvedValue(mockFarm);

    await expect(
      createFarmUseCase.execute({ name: '  test  ', userId: 1 }),
    ).resolves.toEqual(mockFarm);

    expect(create).toHaveBeenCalledWith({ name: 'test', userId: 1 });
    expect(create).toHaveBeenCalledTimes(1);
  });

  it('throws BadRequestException when the farm name is empty', async () => {
    await expect(
      createFarmUseCase.execute({ name: '   ', userId: 1 }),
    ).rejects.toThrow(BadRequestException);

    expect(create).not.toHaveBeenCalled();
  });
});
