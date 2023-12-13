import useSWR, { useSWRConfig } from 'swr';
import { useCallback } from 'react';
import { useActiveUser } from '@/src/contexts/UserProvider/hooks';
import { Folder } from '@/src/types/services/folders';
import env from '@constants/env';

export const useGetWorkflowTestsFoldersByWorkflowId = (workflowId: string) => {
  const { data, error, isLoading, mutate } = useSWR<Folder[]>(
    workflowId ? `/folder/workflowTests/all?workflowId=${workflowId}` : null,
  );

  return {
    workflowTestsFolders: data,
    isLoading,
    error: error,
    refetch: mutate,
  };
};

export const useGetBlockTestsFoldersByWorkflowId = (workflowId: string) => {
  const { data, error, isLoading, mutate } = useSWR<Folder[]>(
    workflowId ? `/folder/blockTests/all?workflowId=${workflowId}` : null,
  );

  return {
    blockTestsFolders: data,
    isLoading,
    error: error,
    refetch: mutate,
  };
};

export const useCreateFolder = () => {
  const { accessToken } = useActiveUser();
  const { mutate } = useSWRConfig();
  const createFolderSdk = useCallback(
    async (url: string, workflowId: string, name: string) => {
      try {
        const requestObj = {
          workflowId,
          name,
        };
        const urlToRun = `${url}`;
        const response = await fetch(urlToRun, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestObj),
        });
        if (!`${response.status}`.startsWith('2')) throw new Error('Error creating folder');
        return await response.json();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    [accessToken],
  );

  const createFolder = useCallback(
    async (data: { workflowId?: string; name?: string }) => {
      const apiURL = `${env.BE_URL}/folder/save`;
      return await mutate(apiURL, createFolderSdk(apiURL, data.workflowId, data.name), false);
    },
    [createFolderSdk, mutate],
  );

  return {
    createFolder,
  };
};

export const useReorderFolders = () => {
  const { accessToken } = useActiveUser();
  const { mutate } = useSWRConfig();
  const reorderFolderSdk = useCallback(
    async (url: string, folders: Folder[]) => {
      try {
        const requestObj = folders;
        const urlToRun = `${url}`;
        const response = await fetch(urlToRun, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestObj),
        });
        if (!`${response.status}`.startsWith('2')) throw new Error('Error creating folder');
        return await response.json();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    [accessToken],
  );

  const reorderFolders = useCallback(
    async (workflowId: string, data: { folders: Folder[] }) => {
      const apiURL = `${env.BE_URL}/folder/${workflowId}/reorder`;
      return await mutate(apiURL, reorderFolderSdk(apiURL, data.folders), false);
    },
    [reorderFolderSdk, mutate],
  );

  return {
    reorderFolders,
  };
};
