'use client';
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/main-layout/page-container';
import ReportTable from '@/components/tables/report-table';
import useFetcher from '@/lib/fetcher';
import { ENDPOINT } from '@/constants/endpoint';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Report', link: '/dashboard/report' }
];

export default function Page() {
  const fetcher = useFetcher({
    url: ENDPOINT.REPORTS,
    triggerOnMount: true
  });

  const reports = fetcher.data?.results ?? [];

  return (
    <PageContainer>
      <div className="space-y-2">
        <Breadcrumbs items={breadcrumbItems} />
        <ReportTable data={reports} reload={fetcher.trigger} />
      </div>
    </PageContainer>
  );
}
