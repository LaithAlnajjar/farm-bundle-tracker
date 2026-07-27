import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FarmSeason } from "@/features/farms/types/farm.types";
import { useFarmToast } from "@/shared/components/farm-ui";
import {
  releaseSlotClaim,
  setSlotClaim,
  setSlotCollection,
  updateFarmSeason,
} from "../services/boardService";
import type { FarmBoard } from "../types/board.types";
import { farmBoardQueryKey } from "./useFarmBoard";
import { boardFingerprint, describeBoardChange } from "../lib/boardChanges";
import { flattenBoard } from "../lib/boardSelectors";

export function useBoardMutations(
  farmId: number,
  markLocalBoard?: (fingerprint: string) => void,
) {
  const queryClient = useQueryClient();
  const { showToast } = useFarmToast();
  const [pendingSlots, setPendingSlots] = useState<Set<number>>(new Set());

  const setSlotPending = useCallback((slotId: number, pending: boolean) => {
    setPendingSlots((current) => {
      const next = new Set(current);
      if (pending) next.add(slotId);
      else next.delete(slotId);
      return next;
    });
  }, []);

  const previousBoard = () =>
    queryClient.getQueryData<FarmBoard>(farmBoardQueryKey(farmId));

  const accept = async (board: FarmBoard) => {
    markLocalBoard?.(boardFingerprint(board));
    queryClient.setQueryData(farmBoardQueryKey(farmId), board);
    await queryClient.invalidateQueries({
      queryKey: farmBoardQueryKey(farmId),
    });
  };

  const collection = useMutation({
    mutationFn: ({
      slotId,
      collected,
    }: {
      slotId: number;
      collected: boolean;
    }) => setSlotCollection(farmId, slotId, collected),
    onMutate: ({ slotId }) => setSlotPending(slotId, true),
    onSuccess: async (board, variables) => {
      const previous = previousBoard();
      const item = previous
        ? flattenBoard(previous).find(({ slot }) => slot.id === variables.slotId)
        : undefined;
      const completion = previous
        ? describeBoardChange(previous, board)
        : null;
      const releasedClaim = variables.collected ? item?.slot.claim : null;
      showToast({
        title:
          completion && ["farm", "room", "bundle"].includes(completion.level)
            ? completion.title
            : variables.collected
              ? `${item?.slot.item.name ?? "Item"} collected`
              : `${item?.slot.item.name ?? "Item"} reopened`,
        description:
          completion && ["farm", "room", "bundle"].includes(completion.level)
            ? completion.description
            : releasedClaim
              ? `${releasedClaim.username}'s claim was released. Claims are not restored when an item is reopened.`
              : item
                ? `${item.room.name} · ${item.bundle.name}`
                : undefined,
        tone: "success",
        actionLabel: variables.collected ? "Uncollect" : undefined,
        onAction: variables.collected
          ? () => collection.mutate({ slotId: variables.slotId, collected: false })
          : undefined,
      });
      await accept(board);
    },
    onError: (_error, variables) => {
      const item = previousBoard()
        ? flattenBoard(previousBoard()!).find(
            ({ slot }) => slot.id === variables.slotId,
          )
        : undefined;
      showToast({
        title: "Collection was not changed",
        description: item
          ? `${item.slot.item.name} still shows its previous state. Try again.`
          : "The board still shows its previous state. Try again.",
        tone: "error",
      });
    },
    onSettled: (_data, _error, variables) =>
      setSlotPending(variables.slotId, false),
  });

  const claim = useMutation({
    mutationFn: ({
      slotId,
      membershipId,
    }: {
      slotId: number;
      membershipId: number;
    }) => setSlotClaim(farmId, slotId, membershipId),
    onMutate: ({ slotId }) => setSlotPending(slotId, true),
    onSuccess: async (board, variables) => {
      const item = flattenBoard(board).find(
        ({ slot }) => slot.id === variables.slotId,
      );
      showToast({
        title: item?.slot.claim
          ? `${item.slot.item.name} assigned to ${item.slot.claim.username}`
          : "Claim updated",
        description: item ? `${item.room.name} · ${item.bundle.name}` : undefined,
        tone: "success",
      });
      await accept(board);
    },
    onError: () =>
      showToast({
        title: "Claim was not changed",
        description: "The previous assignment is still shown. Try again.",
        tone: "error",
      }),
    onSettled: (_data, _error, variables) =>
      setSlotPending(variables.slotId, false),
  });

  const release = useMutation({
    mutationFn: (slotId: number) => releaseSlotClaim(farmId, slotId),
    onMutate: (slotId) => setSlotPending(slotId, true),
    onSuccess: async (board, slotId) => {
      const item = flattenBoard(board).find(({ slot }) => slot.id === slotId);
      showToast({
        title: `${item?.slot.item.name ?? "Item"} is unclaimed`,
        tone: "success",
      });
      await accept(board);
    },
    onError: () =>
      showToast({
        title: "Claim was not released",
        description: "The previous assignment is still shown. Try again.",
        tone: "error",
      }),
    onSettled: (_data, _error, slotId) => setSlotPending(slotId, false),
  });

  const season = useMutation({
    mutationFn: (value: FarmSeason) => updateFarmSeason(farmId, value),
    onSuccess: async (board) => {
      showToast({
        title: `${board.farm.currentSeason[0]?.toUpperCase()}${board.farm.currentSeason.slice(1)} is now the shared season`,
        tone: "success",
      });
      await accept(board);
    },
    onError: () =>
      showToast({
        title: "Season was not changed",
        description: "The farm still uses its previous season.",
        tone: "error",
      }),
  });

  return {
    collection,
    claim,
    release,
    season,
    isSlotPending: (slotId: number) => pendingSlots.has(slotId),
  };
}
