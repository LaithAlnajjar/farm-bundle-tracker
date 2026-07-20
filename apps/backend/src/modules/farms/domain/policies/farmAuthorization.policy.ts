import type { FarmRole } from '../entities/farm';

export type FarmCapability =
  | 'view'
  | 'edit-board'
  | 'manage-members'
  | 'manage-invites'
  | 'rename'
  | 'delete';

const capabilitiesByRole: Record<FarmRole, readonly FarmCapability[]> = {
  owner: [
    'view',
    'edit-board',
    'manage-members',
    'manage-invites',
    'rename',
    'delete',
  ],
  editor: ['view', 'edit-board'],
  viewer: ['view'],
};

export const canAccessFarm = (
  role: FarmRole,
  capability: FarmCapability,
): boolean => capabilitiesByRole[role].includes(capability);
