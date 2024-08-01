import Header from '@/components/main-layout/header';
import Sidebar from '@/components/main-layout/sidebar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Talent Hub'
};

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="w-full flex-1 overflow-hidden">
        <Header />
        {children}
      </main>
    </div>
  );
}
