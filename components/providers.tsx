'use client';
import React from 'react';
import ThemeProvider from './ThemeToggle/theme-provider';
import { TooltipProvider } from './ui/tooltip';

export default function Providers({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>{children}</TooltipProvider>
    </ThemeProvider>
  );
}
