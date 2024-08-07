import { ENDPOINT } from '@/constants/endpoint';
import useFetcher from '@/lib/fetcher';
import { useUserStore } from '@/store/user-store';
import { useRouter } from 'next/navigation';
import { useLayoutEffect } from 'react';

export default function useAuth() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const { trigger } = useFetcher({
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
    if (user?.id) return;

    trigger();
  }, []);
}
