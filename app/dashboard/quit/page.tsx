'use client';
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/main-layout/page-container';
import QuitTable from '@/components/tables/quit-table';
import { ENDPOINT } from '@/constants/endpoint';
import useFetcher from '@/lib/fetcher';
import { Quit } from '@/types';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Resign', link: '/dashboard/quit' }
];

export default function Page() {
  const fetcher = useFetcher({
    url: ENDPOINT.RESIGNS,
    method: 'GET',
    triggerOnMount: true
  });
  const quits: Quit[] = fetcher?.data?.results || [];

  return (
    <PageContainer>
      <div className="space-y-2">
        <Breadcrumbs items={breadcrumbItems} />
        <QuitTable data={quits} reload={() => {}} />
      </div>
    </PageContainer>
  );
}
