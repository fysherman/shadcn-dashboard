'use client';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { columns } from './columns';
import { Contract } from '@/types';
import CreateDialog from './create-dialog';

interface Props {
  data: Contract[];
  reload: () => void;
}

const Table: React.FC<Props> = ({ data, reload }) => {
  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Hợp đồng (${data.length})`}
          description="Quản lí danh sách gia hạn hợp đồng của Thực tập sinh, cộng tác viên"
        />
        <CreateDialog reload={reload} />
      </div>
      <Separator />
      <DataTable
        searchKey="title"
        columns={columns}
        data={data}
        height=" h-[calc(100vh-260px)]"
      />
    </>
  );
};

export default Table;
