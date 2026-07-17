import { ListFarmsUseCase } from './listFarmsUseCase';
import type { FarmRepository } from '../domain/repositories/farm.repository';

describe('ListFarmsUseCase', () => {
  let listFarmsUseCase: ListFarmsUseCase;
  let listByUserId: jest.MockedFunction<FarmRepository['listByUserId']>;

  beforeEach(() => {
    listByUserId = jest.fn();

    const farmRepository: FarmRepository = {
      create: jest.fn(),
      findByIdForUser: jest.fn(),
      listByUserId,
      updateName: jest.fn(),
      softDelete: jest.fn(),
    };

    listFarmsUseCase = new ListFarmsUseCase(farmRepository);
  });

  it('lists the farms belonging to the user', async () => {
    const mockDate = new Date();
    const mockFarms = [
      {
        id: 1,
        name: 'Farm One',
        userId: 42,
        createdAt: mockDate,
        updatedAt: mockDate,
        deletedAt: null,
      },
      {
        id: 2,
        name: 'Farm Two',
        userId: 42,
        createdAt: mockDate,
        updatedAt: mockDate,
        deletedAt: null,
      },
    ];

    listByUserId.mockResolvedValue(mockFarms);

    await expect(listFarmsUseCase.execute(42)).resolves.toEqual(mockFarms);

    expect(listByUserId).toHaveBeenCalledWith(42);
    expect(listByUserId).toHaveBeenCalledTimes(1);
  });
});
