import { useCallback, useMemo } from "react";
import type { SetURLSearchParams } from "react-router";
import type { BoardPreferences } from "../types/board.types";
import {
  boardPreferenceStorageKey,
  boardPreferencesToParams,
  defaultBoardPreferences,
  hasBoardParameters,
  parseBoardPreferences,
  readStoredBoardPreferences,
} from "../lib/boardPreferences";

export function useBoardPreferences(input: {
  farmId: number;
  userId?: number;
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
}) {
  const { farmId, userId, searchParams, setSearchParams } = input;
  const storageKey = useMemo(
    () => (userId ? boardPreferenceStorageKey(userId, farmId) : null),
    [farmId, userId],
  );
  const search = searchParams.toString();
  const preferences = useMemo<BoardPreferences>(() => {
    const params = new URLSearchParams(search);
    if (hasBoardParameters(params)) {
      return parseBoardPreferences(params);
    }
    return storageKey
      ? readStoredBoardPreferences(storageKey) ?? defaultBoardPreferences
      : defaultBoardPreferences;
  }, [search, storageKey]);

  const updatePreferences = useCallback(
    (patch: Partial<BoardPreferences>, options?: { replace?: boolean }) => {
      const next: BoardPreferences = { ...preferences, ...patch };
      if (storageKey) {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      }
      setSearchParams(boardPreferencesToParams(next), {
        replace: options?.replace,
      });
    },
    [preferences, setSearchParams, storageKey],
  );

  const clearPreferences = useCallback(() => {
    if (storageKey) window.localStorage.removeItem(storageKey);
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams, storageKey]);

  return { preferences, updatePreferences, clearPreferences };
}
