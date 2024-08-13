'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Report } from '@/types';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { getStatusVariant } from './helpers';

export const columns: ColumnDef<Report>[] = [
  {
    accessorKey: 'title',
    header: 'Tiêu đề'
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell({ row }) {
      return (
        <Badge className={getStatusVariant(row.original?.status ?? undefined)}>
          {row.original.status}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'created_by_name',
    header: 'Người tạo'
  },
  {
    accessorKey: 'approved_by_name',
    header: 'Người approve'
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
