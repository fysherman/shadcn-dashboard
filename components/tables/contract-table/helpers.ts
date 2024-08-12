import { CONTRACT_STATUS } from '@/constants';
import { ContractStatus } from '@/types';

export function getStatusVariant(status?: ContractStatus) {
  switch (status) {
    case CONTRACT_STATUS.COLLABORATOR_SUBMITTED:
      return 'bg-amber-500';
    case CONTRACT_STATUS.MENTOR_REVIEWED:
      return 'bg-blue-500';
    case CONTRACT_STATUS.MANAGER_REVIEWED:
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
}

export function getStatusName(status?: ContractStatus) {
  switch (status) {
    case CONTRACT_STATUS.COLLABORATOR_SUBMITTED:
      return 'Chờ Mentor đánh giá';
    case CONTRACT_STATUS.MENTOR_REVIEWED:
      return 'Chờ Manager đánh giá';
    case CONTRACT_STATUS.MANAGER_REVIEWED:
      return 'Manager hoàn thành đánh giá';
    default:
      return 'Chờ CTV / TTS điền thông tin';
  }
}
