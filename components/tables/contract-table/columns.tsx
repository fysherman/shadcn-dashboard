'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Contract } from '@/types';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { CONTRACT_STATUS } from '@/constants';

function getStatusVariant(status?: string) {
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

export const columns: ColumnDef<Contract>[] = [
  {
    accessorKey: 'title',
    header: 'Tiêu đề'
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell({ row }) {
      return (
        <Badge className={getStatusVariant(row.original.status ?? '')}>
          {row.original.status}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'collaborator_name',
    header: 'TTS/CTV'
  },
  {
    accessorKey: 'hr_name',
    header: 'HR'
  },
  {
    accessorKey: 'mentor_name',
    header: 'Mentor'
  },
  {
    accessorKey: 'manager_name',
    header: 'Manager'
  },
  {
    accessorKey: 'from_date',
    header: 'Kì hợp đồng',
    cell({ row }) {
      return (
        <>
          <span>
            {row.original.from_date &&
              format(new Date(row.original.from_date), 'yyyy-MM-dd')}
          </span>
          <span> - </span>
          <span>
            {row.original.to_date &&
              format(new Date(row.original.to_date), 'yyyy-MM-dd')}
          </span>
        </>
      );
    }
  },
  {
    accessorKey: 'created',
    header: 'Ngày tạo',
    cell({ row }) {
      return (
        <p>
          {row.original.created &&
            format(new Date(row.original.created), 'yyyy-MM-dd')}
        </p>
      );
    }
  },
  {
    accessorKey: 'updated',
    header: 'Ngày cập nhật',
    cell({ row }) {
      return (
        <p>
          {row.original.updated &&
            format(new Date(row.original.updated), 'yyyy-MM-dd')}
        </p>
      );
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
