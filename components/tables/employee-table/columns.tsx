'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Employee } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { upperCaseFirstLetter } from '@/lib/utils';
import Link from 'next/link';

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: 'image_profile',
    header: 'Avatar',
    cell({ row }) {
      return (
        <Avatar className=" h-8 w-8">
          <AvatarImage
            src={row.original?.image_profile ?? undefined}
            alt={row.original?.username ?? undefined}
          />
          <AvatarFallback>
            {upperCaseFirstLetter(row.original?.username)}
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
    header: 'Account',
    cell({ row }) {
      return (
        <Link
          href={`/dashboard/employee/${row.original?.id}`}
          className=" text-blue-500"
        >
          {row.original?.username}
        </Link>
      );
    }
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
