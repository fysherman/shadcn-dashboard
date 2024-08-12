'use client';

import useAuth from '@/hooks/useAuth';

export default function AuthGuard({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  useAuth();

  return children;
}
