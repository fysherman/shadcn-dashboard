'use client';
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/main-layout/page-container';
import EmployeeTable from '@/components/tables/employee-table';
import useFetcher from '@/lib/fetcher';
import { ENDPOINT } from '@/constants/endpoint';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Employee', link: '/dashboard/employee' }
];

export default function Page() {
  const fetcher = useFetcher({
    url: ENDPOINT.EMPLOYEES,
    triggerOnMount: true
  });

  const talents = fetcher.data?.results ?? [];

  return (
    <PageContainer>
      <div className="space-y-2">
        <Breadcrumbs items={breadcrumbItems} />
        <EmployeeTable data={talents} />
      </div>
    </PageContainer>
  );
}
