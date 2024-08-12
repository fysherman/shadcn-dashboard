import { ENDPOINT } from '@/constants/endpoint';
import useFetcher from '@/lib/fetcher';
import { useUserStore } from '@/store/user-store';
import { usePathname, useRouter } from 'next/navigation';
import { useLayoutEffect } from 'react';

export default function useAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const fetcher = useFetcher({
    url: ENDPOINT.ME,
    method: 'GET',
    silent: true,
    onSuccess(data) {
      setUser(data);
    },
    onError() {
      setUser();
      router.push('/sign-in');
    }
  });

  useLayoutEffect(() => {
    if (pathname === '/sign-in' || user?.id) return;

    fetcher.trigger();
  }, [pathname]);
}
