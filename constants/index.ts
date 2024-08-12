import {
  ContractStatus,
  Role,
  ContractEvaluationCriteria,
  TaskStatus
} from '@/types';

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

export const CONTRACT_STATUS_LEVEL: Record<ContractStatus, number> = {
  HR_CREATED: 1,
  COLLABORATOR_SUBMITTED: 2,
  MENTOR_REVIEWED: 3,
  MANAGER_REVIEWED: 4
};

export const CONTRACT_EVALUATION_CRITERIA: Record<
  ContractEvaluationCriteria,
  ContractEvaluationCriteria
> = {
  GOOD: 'GOOD',
  ABOVE_AVERAGE: 'ABOVE_AVERAGE',
  AVERAGE: 'AVERAGE',
  PASS: 'PASS',
  FAIL: 'FAIL',
  YES: 'YES',
  NO: 'NO',
  AGREE: 'AGREE',
  DISAGREE: 'DISAGREE',
  EXTEND_CONTRACT: 'EXTEND_CONTRACT',
  TERMINATE_CONTRACT: 'TERMINATE_CONTRACT',
  RETAIN: 'RETAIN',
  AGREE_WITH_MENTOR: 'AGREE_WITH_MENTOR'
};
