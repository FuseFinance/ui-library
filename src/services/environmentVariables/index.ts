import useSWR, { useSWRConfig } from 'swr';
import { useCallback } from 'react';
import env from '@constants/env';
import { EnvironmentVariable } from '@/src/types/services/environmentVariables';

export const useGetEnvironmentVariables = () => {
  const { data, error, isLoading } = useSWR<EnvironmentVariable[]>('/environmentVariables');

  return {
    environmentVariables: data,
    isLoading,
    error: error,
  };
};

export const useMutateEnvironmentVariable = () => {
  const { mutate } = useSWRConfig();
  const accessToken = localStorage.getItem('accessToken');

  const apiURL = `${env.BE_URL}/environmentVariables`;

  // TODO This could be the SDK function wrapped in a useCallback
  const createEnvironmentVariableSdk = useCallback(
    async (
      url: string,
      method: 'POST' | 'PUT',
      envVar: {
        id?: string;
        name: string;
        type: string;
        prodValue: string;
        sandboxValue: string;
        devValue: string;
      },
    ) => {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(envVar),
      });
      const data: EnvironmentVariable = await response.json();
      return data;
    },
    [accessToken],
  );

  const deleteEnvironmentVariableSdk = useCallback(
    async (url: string) => {
      await fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
    },
    [accessToken],
  );

  const createEnvironmentVariable = useCallback(
    async (name: string, prodValue: any, sandboxValue: any, devValue: any) => {
      const data = await mutate(
        apiURL,
        createEnvironmentVariableSdk(apiURL, 'POST', {
          name,
          type: 'STRING',
          prodValue,
          sandboxValue,
          devValue,
        }),
        false,
      );
      return data;
    },
    [createEnvironmentVariableSdk, mutate, apiURL],
  );

  const updateEnvironmentVariable = useCallback(
    async (id: string, name: string, prodValue: any, sandboxValue: any, devValue: any) => {
      const data = await mutate(
        apiURL,
        createEnvironmentVariableSdk(apiURL, 'PUT', {
          id,
          name,
          type: 'STRING',
          prodValue,
          sandboxValue,
          devValue,
        }),
        false,
      );
      return data;
    },
    [createEnvironmentVariableSdk, mutate, apiURL],
  );

  const deleteEnvironmentVariable = useCallback(
    async (id: string) => {
      await mutate(apiURL, deleteEnvironmentVariableSdk(`${apiURL}/${id}`), false);
    },
    [deleteEnvironmentVariableSdk, mutate, apiURL],
  );

  return {
    createEnvironmentVariable,
    updateEnvironmentVariable,
    deleteEnvironmentVariable,
  };
};
