'use client';
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/main-layout/page-container';
import ContractTable from '@/components/tables/contract-table';
import useFetcher from '@/lib/fetcher';
import { ENDPOINT } from '@/constants/endpoint';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Contract', link: '/dashboard/contract' }
];

export default function Page() {
  const fetcher = useFetcher({
    url: ENDPOINT.CONTRACTS,
    triggerOnMount: true
  });

  const contracts = fetcher.data?.results ?? [];

  return (
    <PageContainer>
      <div className="space-y-2">
        <Breadcrumbs items={breadcrumbItems} />
        <ContractTable data={contracts} />
      </div>
    </PageContainer>
  );
}
