'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Employee } from '@/types';

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: 'avatar',
    header: 'Avatar'
  },
  {
    accessorKey: 'fullname',
    header: 'Full name'
  },
  {
    accessorKey: 'username',
    header: 'Account'
  },
  {
    accessorKey: 'birth_year',
    header: 'Birth year'
  },
  {
    accessorKey: 'location',
    header: 'Location'
  },
  {
    accessorKey: 'employee_type',
    header: 'Employee type'
  },
  {
    accessorKey: 'department',
    header: 'Department'
  },
  {
    accessorKey: 'join',
    header: 'Joined from'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
