import { ListFarmsUseCase } from './listFarmsUseCase';
import type { FarmListReadRepository } from '../domain/repositories/farmListRead.repository';

describe('ListFarmsUseCase', () => {
  let listFarmsUseCase: ListFarmsUseCase;
  let listForUser: jest.MockedFunction<FarmListReadRepository['listForUser']>;

  beforeEach(() => {
    listForUser = jest.fn();
    listFarmsUseCase = new ListFarmsUseCase({ listForUser });
  });

  it('lists the farms belonging to the user', async () => {
    const mockDate = new Date();
    const mockItems = [
      {
        farm: {
          id: 1,
          name: 'Farm One',
          userId: 42,
          createdAt: mockDate,
          updatedAt: mockDate,
          deletedAt: null,
        },
        summary: {
          progress: {
            completed: 0,
            total: 30,
            percentage: 0,
            complete: false,
          },
          currentSeasonNeededItems: 20,
          currentSeasonUnclaimedItems: 18,
          myActiveClaims: 2,
        },
      },
    ];

    listForUser.mockResolvedValue(mockItems);

    await expect(listFarmsUseCase.execute(42)).resolves.toEqual(mockItems);

    expect(listForUser).toHaveBeenCalledWith(42);
    expect(listForUser).toHaveBeenCalledTimes(1);
  });
});
