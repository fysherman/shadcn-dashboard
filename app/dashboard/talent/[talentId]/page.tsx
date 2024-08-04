import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/main-layout/page-container';
import React from 'react';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Talent', link: '/dashboard/talent' },
  { title: 'Detail', link: '/dashboard/talent' }
];

export default function Page() {
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
      </div>
    </PageContainer>
  );
}
