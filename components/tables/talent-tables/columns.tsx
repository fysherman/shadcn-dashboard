'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { User } from '@/constants/data';
import { Checkbox } from '@/components/ui/checkbox';

export const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'avatar',
    header: 'Avatar'
  },
  {
    accessorKey: 'name',
    header: 'Full name'
  },
  {
    accessorKey: 'account',
    header: 'Account'
  },
  {
    accessorKey: 'birth',
    header: 'Birth year'
  },
  {
    accessorKey: 'location',
    header: 'Location'
  },
  {
    accessorKey: 'type',
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
