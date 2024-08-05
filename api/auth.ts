import useFetcher from '@/lib/fetcher';

export function useAuth() {
  return useFetcher({
    url: '/auth/login/',
    method: 'POST'
  });
}
