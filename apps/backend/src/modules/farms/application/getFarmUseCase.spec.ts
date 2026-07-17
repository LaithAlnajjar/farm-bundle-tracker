import { NotFoundException } from '@nestjs/common';
import { GetFarmUseCase } from './getFarmUseCase';
import type { FarmRepository } from '../domain/repositories/farm.repository';

describe('GetFarmUseCase', () => {
  let getFarmUseCase: GetFarmUseCase;
  let findByIdForUser: jest.MockedFunction<FarmRepository['findByIdForUser']>;

  beforeEach(() => {
    findByIdForUser = jest.fn();

    const farmRepository: FarmRepository = {
      create: jest.fn(),
      findByIdForUser,
      listByUserId: jest.fn(),
      updateName: jest.fn(),
      softDelete: jest.fn(),
    };

    getFarmUseCase = new GetFarmUseCase(farmRepository);
  });

  it('finds a farm with the given id and userId', async () => {
    const mockDate = new Date();
    const mockFarm = {
      id: 1,
      name: 'test',
      userId: 1,
      createdAt: mockDate,
      updatedAt: mockDate,
      deletedAt: null,
    };

    findByIdForUser.mockResolvedValue(mockFarm);

    await expect(getFarmUseCase.execute({ id: 1, userId: 1 })).resolves.toEqual(
      mockFarm,
    );

    expect(findByIdForUser).toHaveBeenCalledWith(1, 1);
    expect(findByIdForUser).toHaveBeenCalledTimes(1);
  });

  it('throws NotFoundException when the farm does not exist for the user', async () => {
    findByIdForUser.mockResolvedValue(null);

    await expect(getFarmUseCase.execute({ id: 1, userId: 42 })).rejects.toThrow(
      NotFoundException,
    );

    expect(findByIdForUser).toHaveBeenCalledWith(1, 42);
    expect(findByIdForUser).toHaveBeenCalledTimes(1);
  });
});
