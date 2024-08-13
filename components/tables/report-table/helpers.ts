import { ReportStatus } from '@/types';

export function getStatusVariant(status?: ReportStatus) {
  switch (status) {
    case 'DONE':
      return 'bg-blue-500';
    case 'SUBMITTED':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
}
