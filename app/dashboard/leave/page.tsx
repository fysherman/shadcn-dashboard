import { Breadcrumbs } from '@/components/breadcrumbs';
import FullCalendar from '@/components/calendar/full-calendar';
import PageContainer from '@/components/main-layout/page-container';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Quản lí nghỉ phép', link: '/dashboard/leave' }
];

export default function page() {
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <FullCalendar />
      </div>
    </PageContainer>
  );
}
