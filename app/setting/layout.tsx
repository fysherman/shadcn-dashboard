'use client';
import Header from '@/components/main-layout/header';
import { Sidebar } from '@/components/setting-layout/sidebar';
import { Separator } from '@/components/ui/separator';
import BackButton from '@/components/setting-layout/back-button';
import useAuth from '@/hooks/useAuth';

const sidebarNavItems = [
  {
    title: 'Profile',
    href: '/setting/profile'
  }
];

export default function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  useAuth();

  return (
    <div>
      <Header />
      <div className="pb-16">
        <div className="px-10">
          <div className=" flex items-center space-x-2">
            <BackButton />
            <div className="space-y-0.5">
              <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
              <p className="text-muted-foreground">
                Manage your account settings.
              </p>
            </div>
          </div>
          <Separator className="my-6" />
        </div>
        <div className="flex">
          <aside className="w-1/5 pl-10">
            <Sidebar items={sidebarNavItems} />
          </aside>
          <div className="flex-1">
            <main className="w-full flex-1 overflow-hidden">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
