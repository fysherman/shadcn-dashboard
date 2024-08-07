import { BASE_API } from '@/constants/endpoint';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export interface FetcherParams {
  url?: string;
  params?: Record<string, any>;
  body?: Record<string, any>;
  rawBody?: BodyInit;
  headers?: Record<string, any>;
  method?: 'POST' | 'GET' | 'PUT' | 'DELETE';
  withToken?: boolean;
  triggerOnMount?: boolean;
  silent?: boolean;
  onError?: (error: any) => void;
  onSuccess?: (data: any) => void;
  onSettled?: () => void;
}

export default function useFetcher(initParams: Readonly<FetcherParams> = {}) {
  let triggeredOnMount = false;
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(!!initParams.triggerOnMount);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  async function trigger(triggerParams: Readonly<FetcherParams> = {}) {
    setLoading(true);
    setError(null);
    setData(null);

    const {
      url = '',
      body,
      method = 'GET',
      params,
      headers,
      rawBody,
      withToken = true,
      silent = false,
      onError = () => {},
      onSuccess = () => {},
      onSettled = () => {}
    } = {
      ...initParams,
      ...triggerParams
    };
    const computedUrl = params
      ? `${BASE_API}${url}?${new URLSearchParams(params).toString()}`
      : `${BASE_API}${url}`;
    const computedHeaders = {
      'Content-Type': 'application/json',
      ...(withToken && {
        Authorization: `Token ${localStorage.getItem('token')}`
      }),
      ...(headers ?? {})
    };

    const resources: RequestInit = {
      method,
      headers: computedHeaders,
      body: rawBody ?? JSON.stringify(body)
    };

    try {
      const response = await fetch(computedUrl, resources);

      if (!response.ok) throw new Error(response.status.toString());

      const data = await response.json();

      setData(data);
      onSuccess(data);

      console.info(url, data);
    } catch (error: any) {
      setError(error);
      onError(error);

      if (error.message === '401') router.push('/sign-in');
      if (!silent) toast.error('Đã xảy ra lỗi');

      console.warn(url, error);
    } finally {
      onSettled();
      setLoading(false);
    }
  }

  useEffect(() => {
    if (initParams.triggerOnMount && !triggeredOnMount) trigger();

    return () => {
      // Avoid effect firing twice in development
      triggeredOnMount = true;
    };
  }, []);

  return {
    data,
    error,
    loading,
    trigger
  };
}
