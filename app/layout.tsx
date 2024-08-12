import Providers from '@/components/providers';
import { Toaster } from '@/components/ui/sonner';
import '@uploadthing/react/styles.css';
import type { Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthGuard from '@/components/auth-guard';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Talent Hub'
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} overflow-hidden `}
        suppressHydrationWarning={true}
      >
        <NextTopLoader color="#16a34a" showSpinner={false} />
        <Providers>
          <AuthGuard>
            <Toaster richColors />
            {children}
          </AuthGuard>
        </Providers>
      </body>
    </html>
  );
}
