import useSWR, { useSWRConfig } from 'swr';
import { useCallback } from 'react';
import { useActiveUser } from '@/src/contexts/UserProvider/hooks';
import { TempData } from '@/src/types/services/tempData';
import env from '@constants/env';

export const useGetTempData = (client: string) => {
  const { data, error, isLoading, mutate } = useSWR<TempData>(
    client ? `/tempData/${client}` : null,
  );

  return {
    tempData: data,
    isLoading: isLoading,
    error,
    refetch: mutate,
  };
};

export const useMutateTempData = () => {
  const { mutate } = useSWRConfig();
  const { accessToken } = useActiveUser();

  const createTempDataSdk = useCallback(
    async (url: string, client: string, tempData: string) => {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: tempData,
          client,
        }),
      });
      const data = await response.json();
      if (`${response.status}`.startsWith('4') || `${response.status}`.startsWith('5'))
        throw new Error(data.message);
      return data;
    },
    [accessToken],
  );

  const createTempData = useCallback(
    async (client: string, tempData: string) => {
      const apiURL = `${env.BE_URL}/tempData`;
      const data = await mutate<TempData>(
        apiURL,
        createTempDataSdk(apiURL, client, tempData),
        false,
      );
      return data;
    },
    [createTempDataSdk, mutate],
  );

  const updateTempDataSdk = useCallback(
    async (url: string, id: string, client: string, tempData: string) => {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          data: tempData,
          client,
        }),
      });
      const data = await response.json();
      if (`${response.status}`.startsWith('4') || `${response.status}`.startsWith('5'))
        throw new Error(data.message);
      return data;
    },
    [accessToken],
  );

  const updateTempData = useCallback(
    async (id: string, client: string, tempData: string) => {
      const apiURL = `${env.BE_URL}/tempData`;
      const data = await mutate<TempData>(
        apiURL,
        updateTempDataSdk(apiURL, id, client, tempData),
        false,
      );
      return data;
    },
    [updateTempDataSdk, mutate],
  );

  return {
    createTempData,
    updateTempData,
  };
};
