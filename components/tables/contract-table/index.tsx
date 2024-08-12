'use client';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { columns } from './columns';
import { Employee } from '@/types';

interface Props {
  data: Employee[];
}

const Table: React.FC<Props> = ({ data }) => {
  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Hợp đồng (${data.length})`}
          description="Quản lí danh sách gia hạn hợp đồng của Thực tập sinh, cộng tác viên"
        />
      </div>
      <Separator />
      <DataTable
        searchKey="username"
        columns={columns}
        data={data}
        height=" h-[calc(100vh-260px)]"
      />
    </>
  );
};

export default Table;
