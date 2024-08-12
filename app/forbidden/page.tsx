'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/store/user-store';
import { ROLES } from '@/constants';

export default function Forbidden() {
  const router = useRouter();
  const role = useUserStore((state) => state.role);

  function goHome() {
    if (!role || role === ROLES.COLLABORATOR) {
      router.push('/dashboard/leave');
      return;
    }

    router.push('/dashboard/employee');
  }

  return (
    <div className="absolute left-1/2 top-1/2 mb-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center">
      <span className="bg-gradient-to-b from-foreground to-transparent bg-clip-text text-[10rem] font-extrabold leading-none text-transparent">
        403
      </span>
      <h2 className="font-heading my-2 text-2xl font-bold">Oops! Forbidden</h2>
      <p>Sorry, you don&apos;t have permission to access this resource.</p>
      <div className="mt-8 flex justify-center gap-2">
        <Button onClick={goHome} variant="default" size="lg">
          Go home
        </Button>
      </div>
    </div>
  );
}
