'use client';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => router.push('/dashboard/employee')}
    >
      <ChevronLeft className=" h-8 w-8" />
    </Button>
  );
}
