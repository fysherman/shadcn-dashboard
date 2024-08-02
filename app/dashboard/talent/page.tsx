import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/main-layout/page-container';
import { users } from '@/constants/data';
import TalentTable from '@/components/tables/talent-tables';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'User', link: '/dashboard/user' }
];

export default function Page() {
  return (
    <PageContainer>
      <div className="space-y-2">
        <Breadcrumbs items={breadcrumbItems} />
        <TalentTable data={users} />
      </div>
    </PageContainer>
  );
}
