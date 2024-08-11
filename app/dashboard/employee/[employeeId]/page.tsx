import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/main-layout/page-container';
import React from 'react';
import { Detail } from './detail';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Employee', link: '/dashboard/employee' },
  { title: 'Detail', link: '/dashboard/employee' }
];

export default function Page() {
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-10">
        <Breadcrumbs items={breadcrumbItems} />
        <Detail />
      </div>
    </PageContainer>
  );
}
