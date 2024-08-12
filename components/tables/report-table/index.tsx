'use client';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { columns } from './columns';
import { Report } from '@/types';
import CreateDialog from './create-dialog';
import DetailDialog from './detail-dialog';

interface Props {
  data: Report[];
  reload: () => void;
}

const Table: React.FC<Props> = ({ data, reload }) => {
  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Báo cáo (${data.length})`}
          description="Quản lí báo cáo của Thực tập sinh, cộng tác viên"
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
      <DetailDialog />
    </>
  );
};

export default Table;
