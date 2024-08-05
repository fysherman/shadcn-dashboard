'use client';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { User } from '@/constants/nav-item';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { columns } from './columns';

interface Props {
  data: User[];
}

const TalentTable: React.FC<Props> = ({ data }) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Thực tập sinh / Cộng tác viên (${data.length})`}
          description="Quản lí danh sách Thực tập sinh, cộng tác viên"
        />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/dashboard/talent/new`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable
        searchKey="name"
        columns={columns}
        data={data}
        height=" h-[calc(100vh-300px)]"
      />
    </>
  );
};

export default TalentTable;
