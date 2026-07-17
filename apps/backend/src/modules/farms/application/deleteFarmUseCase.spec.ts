import { NotFoundException } from '@nestjs/common';
import { DeleteFarmUseCase } from './deleteFarmUseCase';
import type { FarmRepository } from '../domain/repositories/farm.repository';

describe('DeleteFarmUseCase', () => {
  let deleteFarmUseCase: DeleteFarmUseCase;
  let softDelete: jest.MockedFunction<FarmRepository['softDelete']>;

  beforeEach(() => {
    softDelete = jest.fn();

    const farmRepository: FarmRepository = {
      create: jest.fn(),
      findByIdForUser: jest.fn(),
      listByUserId: jest.fn(),
      updateName: jest.fn(),
      softDelete,
    };

    deleteFarmUseCase = new DeleteFarmUseCase(farmRepository);
  });

  it('deletes the farm when it exists and belongs to the user', async () => {
    softDelete.mockResolvedValue(true);

    await expect(
      deleteFarmUseCase.execute({ id: 1, userId: 42 }),
    ).resolves.toBeUndefined();

    expect(softDelete).toHaveBeenCalledWith(1, 42);
    expect(softDelete).toHaveBeenCalledTimes(1);
  });

  it('throws NotFoundException when no farm was deleted', async () => {
    softDelete.mockResolvedValue(false);

    await expect(
      deleteFarmUseCase.execute({ id: 1, userId: 42 }),
    ).rejects.toThrow(NotFoundException);

    expect(softDelete).toHaveBeenCalledWith(1, 42);
    expect(softDelete).toHaveBeenCalledTimes(1);
  });
});
