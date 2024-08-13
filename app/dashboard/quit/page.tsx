'use client';
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/main-layout/page-container';
import QuitTable from '@/components/tables/quit-table';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Report', link: '/dashboard/report' }
];

export default function Page() {
  const quits: any[] = [];

  return (
    <PageContainer>
      <div className="space-y-2">
        <Breadcrumbs items={breadcrumbItems} />
        <QuitTable data={quits} reload={() => {}} />
      </div>
    </PageContainer>
  );
}
