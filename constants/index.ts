import { ContractStatus, Role, TaskStatus } from '@/types';

export const ROLES: Record<Role, Role> = {
  HR: 'HR',
  MANAGER: 'MANAGER',
  MENTOR: 'MENTOR',
  COLLABORATOR: 'COLLABORATOR'
};

export const TASK_STATUS: Record<TaskStatus, TaskStatus> = {
  TO_DO: 'TO_DO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE'
};

export const taskColumns: { id: TaskStatus; title: string }[] = [
  {
    id: 'TO_DO' as const,
    title: 'Todo'
  },
  {
    id: 'IN_PROGRESS' as const,
    title: 'In progress'
  },
  {
    id: 'DONE' as const,
    title: 'Done'
  }
];

export const CONTRACT_STATUS: Record<ContractStatus, ContractStatus> = {
  HR_CREATED: 'HR_CREATED',
  COLLABORATOR_SUBMITTED: 'COLLABORATOR_SUBMITTED',
  MENTOR_REVIEWED: 'MENTOR_REVIEWED',
  MANAGER_REVIEWED: 'MANAGER_REVIEWED'
};
