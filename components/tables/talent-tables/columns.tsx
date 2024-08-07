'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Employee } from '@/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: 'image_profile',
    header: 'Avatar',
    cell({ row }) {
      return (
        <Avatar className=" h-8 w-8">
          <AvatarFallback>
            {row.original?.username?.[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
      );
    }
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
    accessorKey: 'address',
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
