'use client';
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/main-layout/page-container';
import TalentTable from '@/components/tables/talent-tables';
import { Skeleton } from '@/components/ui/skeleton';
import useFetcher from '@/lib/fetcher';
import { ENDPOINT } from '@/constants/endpoint';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Talent', link: '/dashboard/talent' }
];

export default function Page() {
  const { loading, data, error } = useFetcher({
    url: ENDPOINT.EMPLOYEES,
    withToken: true,
    triggerOnMount: true
  });

  return (
    <PageContainer>
      <div className="space-y-2">
        <Breadcrumbs items={breadcrumbItems} />
        {loading && <Skeleton className=" h-60 w-full" />}
        {!loading && !error && <TalentTable data={data} />}
      </div>
    </PageContainer>
  );
}
