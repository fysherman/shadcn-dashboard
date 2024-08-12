'use client';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { ContractTask } from '@/types';

interface Props {
  data: ContractTask[];
}

const Table: React.FC<Props> = ({ data }) => {
  return (
    <DataTable
      searchable={false}
      columns={columns}
      data={data}
      height=" h-auto"
    />
  );
};

export default Table;
