import useSWR, { useSWRConfig } from 'swr';
import { useCallback } from 'react';
import { useActiveUser } from '@/src/contexts/UserProvider/hooks';
import { LockedWorkflowError } from '@/src/services/errorHandler/errorClases';
import env from '@/src/constants/env';
import { EnvironmentCreateBranchResponse, FeaturedBranch } from '@/src/types/services/environment';
import { Environment } from '@/src/types/services/workflows';

export const useGetEnvironments = () => {
  const { data, error, isLoading } = useSWR<FeaturedBranch[]>('/environment');

  return {
    environments: data,
    isLoading,
    error: error,
  };
};

export const useCreateBranch = () => {
  const { mutate } = useSWRConfig();
  const { accessToken } = useActiveUser();
  const apiURL = `${env.BE_URL}/environment/branch`;
  // This could be the SDK function wrapped in a useCallback
  const createBranchSdk = useCallback(
    async (url: string, branchName: string, branchFrom: string) => {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          branchName,
          branchFrom,
        }),
      });
      const data: EnvironmentCreateBranchResponse & { message?: string } = await response.json();
      if (response.status === 403) throw new LockedWorkflowError(data.message, response.status);

      return data;
    },
    [accessToken],
  );

  const createbranch = useCallback(
    async (branchName: string, branchFrom: string) => {
      const data = await mutate(apiURL, createBranchSdk(apiURL, branchName, branchFrom), false);
      return data;
    },
    [createBranchSdk, mutate, apiURL],
  );

  return {
    createBranch: createbranch,
  };
};

export const useLockUnlockEnvironment = () => {
  const { mutate } = useSWRConfig();
  const { accessToken } = useActiveUser();
  // This could be the SDK function wrapped in a useCallback
  const lockUnlockEnvironmentSdk = useCallback(
    async (url: string, environmentName: string) => {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          environmentName,
        }),
      });
      const data: Environment & { message?: string } = await response.json();
      if (response.status === 403) throw new LockedWorkflowError(data.message, response.status);
      return data;
    },
    [accessToken],
  );

  const lockEnvironment = useCallback(
    async (environmentName: string) => {
      const apiURL = `${env.BE_URL}/environment/lock`;
      const data = await mutate(apiURL, lockUnlockEnvironmentSdk(apiURL, environmentName), false);
      return data;
    },
    [lockUnlockEnvironmentSdk, mutate],
  );

  const unlockEnvironment = useCallback(
    async (environmentName: string) => {
      const apiURL = `${env.BE_URL}/environment/unlock`;
      const data = await mutate(apiURL, lockUnlockEnvironmentSdk(apiURL, environmentName), false);
      return data;
    },
    [lockUnlockEnvironmentSdk, mutate],
  );

  const kickoutFromEnvironment = useCallback(
    async (environmentName: string) => {
      const apiURL = `${env.BE_URL}/environment/kickout`;
      const data = await mutate(apiURL, lockUnlockEnvironmentSdk(apiURL, environmentName), false);
      return data;
    },
    [lockUnlockEnvironmentSdk, mutate],
  );

  return {
    lockEnvironment,
    unlockEnvironment,
    kickoutFromEnvironment,
  };
};
