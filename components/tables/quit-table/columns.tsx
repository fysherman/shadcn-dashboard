'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Quit } from '@/types';
import { format } from 'date-fns';

export const columns: ColumnDef<Quit>[] = [
  {
    accessorKey: 'title',
    header: 'Tiêu đề'
  },
  {
    accessorKey: 'end_date',
    header: 'Ngày làm việc cuối cùng',
    cell({ row }) {
      return (
        <p>
          {row.original.end_date &&
            format(new Date(row.original.end_date), 'yyyy-MM-dd')}
        </p>
      );
    }
  },
  {
    accessorKey: 'collaborator_name',
    header: 'Người tạo'
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
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
