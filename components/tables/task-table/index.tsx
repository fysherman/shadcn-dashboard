'use client';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { Task } from '@/types';

interface Props {
  data: Task[];
}

const Table: React.FC<Props> = ({ data }) => {
  return (
    <DataTable
      searchable={false}
      columns={columns}
      data={data}
      height=" h-auto max-h-[400px]"
    />
  );
};

export default Table;
