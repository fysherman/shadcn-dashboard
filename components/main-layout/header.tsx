import React from 'react';
import ThemeToggle from '@/components/main-layout/ThemeToggle/theme-toggle';
import { UserNav } from './user-nav';

export default function Header() {
  return (
    <header className="sticky inset-x-0 top-0 w-full">
      <nav className="flex items-center px-4 py-2">
        <div className="ml-auto flex items-center gap-2">
          <UserNav />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
