import { Permissions } from '@/src/utils/types/sharedEnums';
import { useActiveUser } from '@/src/contexts/UserProvider/hooks';
import useSWR, { useSWRConfig } from 'swr';
import { useCallback } from 'react';
import env from '@/src/constants/env';
export const useGetPermissions = () => {
  const { data, error, isLoading } = useSWR<Permissions[]>('/auth/permissions');

  return {
    data,
    isLoading,
    error,
  };
};

export const useGetUserProfileData = () => {
  const { mutate } = useSWRConfig();
  const { accessToken } = useActiveUser();
  // This could be the SDK function wrapped in a useCallback
  const getUserProfileDataSdk = useCallback(
    async (url: string) => {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      return data;
    },
    [accessToken],
  );

  const getUserProfileData = useCallback(
    async (userId: string) => {
      const apiURL = `${env.BE_URL}/auth/userProfile/${encodeURIComponent(userId)}`;
      const data = await mutate(apiURL, getUserProfileDataSdk(apiURL), false);
      return data;
    },
    [getUserProfileDataSdk, mutate],
  );

  return {
    getUserProfileData,
  };
};
