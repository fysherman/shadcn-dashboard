'use client';
import { Breadcrumbs } from '@/components/breadcrumbs';
import FullCalendar from '@/components/calendar/full-calendar';
import PageContainer from '@/components/main-layout/page-container';
import { useState } from 'react';
import { CreateDialog } from './create-dialog';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Quản lí nghỉ phép', link: '/dashboard/leave' }
];

export default function Page() {
  const [openCreate, setOpenCreate] = useState(false);

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <FullCalendar setOpenCreate={setOpenCreate} />
        <CreateDialog open={openCreate} setOpen={setOpenCreate} />
      </div>
    </PageContainer>
  );
}
