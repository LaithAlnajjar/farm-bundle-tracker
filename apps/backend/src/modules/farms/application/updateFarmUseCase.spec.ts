import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateFarmUseCase } from './updateFarmUseCase';
import type { FarmRepository } from '../domain/repositories/farm.repository';

describe('UpdateFarmUseCase', () => {
  let updateFarmUseCase: UpdateFarmUseCase;
  let updateName: jest.MockedFunction<FarmRepository['updateName']>;

  beforeEach(() => {
    updateName = jest.fn();

    const farmRepository: FarmRepository = {
      create: jest.fn(),
      findByIdForUser: jest.fn(),
      listByUserId: jest.fn(),
      updateName,
      softDelete: jest.fn(),
    };

    updateFarmUseCase = new UpdateFarmUseCase(farmRepository);
  });

  it('updates the farm when it exists and belongs to the user', async () => {
    const mockDate = new Date();
    const mockFarm = {
      id: 1,
      name: 'Updated Farm',
      userId: 42,
      createdAt: mockDate,
      updatedAt: mockDate,
      deletedAt: null,
    };

    updateName.mockResolvedValue(mockFarm);

    await expect(
      updateFarmUseCase.execute({
        id: 1,
        userId: 42,
        name: '  Updated Farm  ',
      }),
    ).resolves.toEqual(mockFarm);

    expect(updateName).toHaveBeenCalledWith({
      id: 1,
      userId: 42,
      name: 'Updated Farm',
    });
    expect(updateName).toHaveBeenCalledTimes(1);
  });

  it('throws BadRequestException when the farm name is empty', async () => {
    await expect(
      updateFarmUseCase.execute({ id: 1, userId: 42, name: '   ' }),
    ).rejects.toThrow(BadRequestException);

    expect(updateName).not.toHaveBeenCalled();
  });

  it('throws NotFoundException when no farm was updated', async () => {
    updateName.mockResolvedValue(null);

    await expect(
      updateFarmUseCase.execute({ id: 1, userId: 42, name: 'Updated Farm' }),
    ).rejects.toThrow(NotFoundException);

    expect(updateName).toHaveBeenCalledWith({
      id: 1,
      userId: 42,
      name: 'Updated Farm',
    });
    expect(updateName).toHaveBeenCalledTimes(1);
  });
});
