'use client';
import { ContractTask } from '@/types';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<ContractTask>[] = [
  {
    accessorKey: 'index',
    header: ''
  },
  {
    accessorKey: 'title',
    header: 'Tiêu đề'
  },
  {
    accessorKey: 'result',
    header: 'Kết quả'
  }
];
