'use client';
import Header from '@/components/main-layout/header';
import Sidebar from '@/components/main-layout/sidebar';
import useAuth from '@/hooks/useAuth';

export default function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  useAuth();

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
