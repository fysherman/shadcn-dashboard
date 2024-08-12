'use client';
import { ColumnDef } from '@tanstack/react-table';
import { Task } from '@/types';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { TASK_STATUS } from '@/constants';

function getStatusVariant(status?: string) {
  switch (status) {
    case TASK_STATUS.DONE:
      return 'bg-green-500';
    case TASK_STATUS.IN_PROGRESS:
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
}

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: 'title',
    header: 'Title'
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell({ row }) {
      return (
        <Badge className={getStatusVariant(row.original.status)}>
          {row.original.status}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'assignee_name',
    header: 'Assignee'
  },
  {
    accessorKey: 'reporter_name',
    header: 'Reporter'
  },
  {
    accessorKey: 'created',
    header: 'Ngày tạo',
    cell({ row }) {
      return <p>{format(new Date(row.original.created), 'yyyy-MM-dd')}</p>;
    }
  }
];
