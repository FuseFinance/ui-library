import useSWR, { useSWRConfig } from 'swr';
import { NotificationsConfig } from '@/src/types/services/notificationsConfig';
import { useCallback } from 'react';
import env from '@constants/env';

export const useGetNotificationsConfig = () => {
  const { data, error, isLoading, mutate } = useSWR<NotificationsConfig[]>('/notificationsConfig');

  return {
    notificationsConfig: data,
    isLoading,
    refetch: mutate,
    error: error,
  };
};

export const useMutateNotificationsConfig = () => {
  const { mutate } = useSWRConfig();
  const accessToken = localStorage.getItem('accessToken');

  const apiURL = `${env.BE_URL}/notificationsConfig/updateEmails`;

  const updateEmailsSdk = useCallback(
    async (
      url: string,
      method: 'PUT',
      payload: {
        id: string;
        emails: string[];
      },
    ) => {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      return data;
    },
    [accessToken],
  );

  const updateEmails = useCallback(
    async (id: string, emails) => {
      const data = await mutate(
        apiURL,
        updateEmailsSdk(apiURL, 'PUT', {
          id,
          emails,
        }),
        false,
      );
      return data;
    },
    [updateEmailsSdk, mutate, apiURL],
  );

  return {
    updateEmails,
  };
};
