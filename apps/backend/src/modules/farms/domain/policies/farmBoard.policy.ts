import type {
  BoardBundle,
  BoardBundleSource,
  BoardProgress,
  FarmBoard,
  FarmBoardSource,
} from '../entities/farmBoard';
import { canAccessFarm } from './farmAuthorization.policy';

const percentage = (value: number, total: number) =>
  total === 0 ? 0 : Math.round((value / total) * 100);

/**
 * The single definition of bundle completion. A bundle needs `requiredSlots`
 * of its slots collected; any slots beyond that are optional.
 */
export function isBundleComplete(
  collected: number,
  requiredSlots: number,
): boolean {
  return collected >= requiredSlots;
}

export function deriveBundle(bundle: BoardBundleSource): BoardBundle {
  const collected = bundle.slots.filter((slot) => slot.collection).length;
  const credited = Math.min(collected, bundle.requiredSlots);
  const complete = isBundleComplete(collected, bundle.requiredSlots);
  return {
    ...bundle,
    progress: {
      collected,
      credited,
      required: bundle.requiredSlots,
      total: bundle.slots.length,
      percentage: percentage(credited, bundle.requiredSlots),
      complete,
    },
    slots: bundle.slots.map((slot) => ({
      ...slot,
      needed: !slot.collection && !complete,
      claimable: !slot.collection && !complete,
    })),
  };
}

export function deriveProgress(
  completed: number,
  total: number,
): BoardProgress {
  return {
    completed,
    total,
    percentage: percentage(completed, total),
    complete: total > 0 && completed === total,
  };
}

export function deriveFarmBoard(source: FarmBoardSource): FarmBoard {
  let completedBundles = 0;
  let totalBundles = 0;
  const rooms = source.rooms.map((room) => {
    const bundles = room.bundles.map(deriveBundle);
    const roomCompleted = bundles.filter(
      (bundle) => bundle.progress.complete,
    ).length;
    completedBundles += roomCompleted;
    totalBundles += bundles.length;
    return {
      ...room,
      bundles,
      progress: deriveProgress(roomCompleted, bundles.length),
    };
  });
  return {
    farm: source.farm,
    catalog: source.catalog,
    canEdit: canAccessFarm(source.farm.membershipRole, 'edit-board'),
    progress: deriveProgress(completedBundles, totalBundles),
    claimableMembers: source.members.filter(
      (member) => member.role === 'owner' || member.role === 'editor',
    ),
    rooms,
  };
}
