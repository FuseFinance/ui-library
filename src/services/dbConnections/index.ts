import { useCallback } from 'react';
import useSWR, { mutate, useSWRConfig } from 'swr';
import env from '@constants/env';
import { useActiveUser } from '@contexts/UserProvider/hooks';
import { DBConnections, DBConnectionsResponse } from '@/src/types/services/dbConnections';
import { HttpMethod } from '@/src/types/common';
import { LockedWorkflowError } from '../errorHandler/errorClases';

export const useGetDBConnections = () => {
  const { data, error, isLoading, mutate } = useSWR<DBConnectionsResponse[]>('/db-connection');
  return {
    dbConnections: data || [],
    total: data?.length || 0,
    isLoading: isLoading,
    error,
    refetch: mutate,
  };
};

export const useSaveDBConnection = () => {
  const { accessToken } = useActiveUser();

  const DBConnectionSDK = useCallback(
    async (
      url: string,
      dbConnection: DBConnections,
      method: HttpMethod.POST | HttpMethod.PATCH,
    ) => {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dbConnection),
      });

      if (!response.ok) {
        throw new Error(`DB Connection ERROR HTTP: ${url} -  Status: ${response.status}`);
      }

      return await response.json();
    },
    [accessToken],
  );

  const createDBConnection = useCallback(
    async (connection_data: DBConnections) => {
      const url = `${env.BE_URL}/db-connection`;

      try {
        const data = await mutate<DBConnectionsResponse>(
          url,
          DBConnectionSDK(url, connection_data, HttpMethod.POST),
          false,
        );
        return data;
      } catch (error) {
        throw new Error('Error creating DB Connection', error);
      }
    },
    [DBConnectionSDK],
  );

  const updateDBConnection = useCallback(
    async (connectionID: string, connection_data: DBConnections) => {
      const url = `${env.BE_URL}/db-connection/${connectionID}`;
      try {
        const data = await mutate<DBConnectionsResponse>(
          url,
          DBConnectionSDK(url, connection_data, HttpMethod.PATCH),
          false,
        );
        return data;
      } catch (error) {
        throw new Error('Error updating DB Connection', error);
      }
    },
    [DBConnectionSDK],
  );

  return { createDBConnection, updateDBConnection };
};

export const useDeleteDBConnection = () => {
  const { mutate } = useSWRConfig();
  const { accessToken } = useActiveUser();

  const deleteDBConnectionSDK = useCallback(
    async (url: string) => {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 403) throw new LockedWorkflowError('', response.status);
      if (`${response.status}`.startsWith('4') || `${response.status}`.startsWith('5'))
        throw new Error('Error deleting DB Connection');
    },
    [accessToken],
  );

  const deleteDBConnection = useCallback(
    async (connectionID: string) => {
      const url = `${env.BE_URL}/db-connection/${connectionID}`;

      await mutate(url, deleteDBConnectionSDK(url), false);
    },
    [deleteDBConnectionSDK, mutate],
  );

  return {
    deleteDBConnection,
  };
};
