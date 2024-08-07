import { Role } from '@/types';

type Key = 'MANAGER' | 'MENTOR' | 'COLLABORATOR' | 'HR';

export const ROLES: Record<Key, Role> = {
  HR: 'HR',
  MANAGER: 'MANAGER',
  MENTOR: 'MENTOR',
  COLLABORATOR: 'COLLABRATOR'
};
