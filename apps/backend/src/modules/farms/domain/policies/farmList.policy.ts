import type { FarmListSummary } from '../entities/farmListItem';
import { deriveProgress, isBundleComplete } from './farmBoard.policy';

/**
 * One catalog slot of one farm, reduced to the facts the list summary needs.
 * A read repository supplies these; deciding what they mean happens here, using
 * the same completion rule the board uses.
 */
export type FarmListSlot = {
  bundleId: number;
  requiredSlots: number;
  collected: boolean;
  claimed: boolean;
  claimedByMe: boolean;
  inSeason: boolean;
};

export function deriveFarmListSummary(slots: FarmListSlot[]): FarmListSummary {
  const collectedByBundle = new Map<number, number>();
  const requiredByBundle = new Map<number, number>();
  for (const slot of slots) {
    requiredByBundle.set(slot.bundleId, slot.requiredSlots);
    if (slot.collected) {
      collectedByBundle.set(
        slot.bundleId,
        (collectedByBundle.get(slot.bundleId) ?? 0) + 1,
      );
    }
  }

  const completeBundles = new Set<number>();
  for (const [bundleId, requiredSlots] of requiredByBundle) {
    if (isBundleComplete(collectedByBundle.get(bundleId) ?? 0, requiredSlots)) {
      completeBundles.add(bundleId);
    }
  }

  let currentSeasonNeededItems = 0;
  let currentSeasonUnclaimedItems = 0;
  let myActiveClaims = 0;
  for (const slot of slots) {
    if (slot.claimedByMe) myActiveClaims += 1;
    const outstanding =
      !slot.collected && !completeBundles.has(slot.bundleId) && slot.inSeason;
    if (!outstanding) continue;
    currentSeasonNeededItems += 1;
    if (!slot.claimed) currentSeasonUnclaimedItems += 1;
  }

  return {
    progress: deriveProgress(completeBundles.size, requiredByBundle.size),
    currentSeasonNeededItems,
    currentSeasonUnclaimedItems,
    myActiveClaims,
  };
}
