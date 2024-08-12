import { Separator } from '@/components/ui/separator';
import { ProfileForm } from './profile-form';
import PageContainer from '@/components/setting-layout/page-container';

export default function Page() {
  return (
    <PageContainer scrollable={true}>
      <div className="max-w-4xl space-y-2">
        <div>
          <h3 className="text-lg font-medium">Profile</h3>
          <p className="text-sm text-muted-foreground">
            Quản lí thông tin cá nhân.
          </p>
        </div>
        <Separator />
        <ProfileForm />
      </div>
    </PageContainer>
  );
}
