'use client';
import React from 'react';
import ThemeProvider from './ThemeToggle/theme-provider';

export default function Providers({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}
