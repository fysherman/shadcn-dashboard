import { useState } from 'react';

export interface FetcherParams {
  url?: string;
  params?: Record<string, any>;
  body?: Record<string, any>;
  rawBody?: BodyInit;
  headers?: Record<string, any>;
  method?: 'POST' | 'GET' | 'PUT' | 'DELETE';
  withToken?: boolean;
}

// const BASE_API = 'https://phandc-fci-pc.tail58805.ts.net';
const BASE_API = 'http://10.36.7.9:8000';

export default function useFetcher(initParams: Readonly<FetcherParams>) {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>();
  const [error, setError] = useState<any>();

  async function fetchData(triggerParams: Readonly<FetcherParams>) {
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
      withToken
    } = {
      ...initParams,
      ...triggerParams
    };
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
      const response = await fetch(
        params
          ? `${BASE_API}${url}?${new URLSearchParams(params).toString()}`
          : `${BASE_API}${url}`,
        resources
      );

      if (!response.ok) throw new Error(response.status.toString());

      const data = await response.json();
      console.info(url, data);

      setData(data);
    } catch (error: any) {
      console.warn(url, error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    data,
    trigger: fetchData
  };
}
