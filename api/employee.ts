import useFetcher from '@/lib/fetcher';

export function useEmployees() {
  return useFetcher({
    url: '/api/employees/',
    method: 'GET',
    withToken: true
  });
}
