import { useCallback, useState } from 'react';
import type { FarmMode } from '@/types/home';

/** Holds the Solo/Shared selection for the comparison section. */
export function useFarmMode(initial: FarmMode = 'solo') {
  const [mode, setMode] = useState<FarmMode>(initial);

  const isActive = useCallback((candidate: FarmMode) => candidate === mode, [mode]);

  return { mode, setMode, isActive };
}
