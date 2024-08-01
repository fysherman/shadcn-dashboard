'use client';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => router.push('/dashboard/talent')}
    >
      <Icons.chevronLeft className=" h-8 w-8" />
    </Button>
  );
}
