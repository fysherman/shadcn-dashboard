'use client';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { columns } from './columns';
import { Quit } from '@/types';
import CreateDialog from './create-dialog';
import DetailDialog from './detail-dialog';

interface Props {
  data: Quit[];
  reload: () => void;
}

const Table: React.FC<Props> = ({ data, reload }) => {
  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Thông báo nghỉ việc (${data.length})`}
          description="Danh sách Thông báo nghỉ việc của CTV / TTS"
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
      <DetailDialog reload={reload} />
    </>
  );
};

export default Table;
