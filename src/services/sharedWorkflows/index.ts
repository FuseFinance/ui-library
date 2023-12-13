import useSWR, { useSWRConfig } from 'swr';
import { useCallback } from 'react';
import { useActiveUser } from '@/src/contexts/UserProvider/hooks';

import { LockedWorkflowError } from '@/src/services/errorHandler/errorClases';
import { getFetcherAuth } from './helpers';
import env from '@/src/constants/env';
import { addQueryParamsToString } from '@components/Editor/FlowCanvas/hooks';

import { ConfigVar, IWorkflowConfig } from '@/src/types/services/workflows';
import {
  SharedWorkflow,
  TConfigFile,
  TSharedWorkflowVersion,
  EImportType,
} from '@/src/types/services/sharedWorkflows';

export const useUpsertWorkflowConfigVariables = () => {
  const { accessToken } = useActiveUser();
  const { mutate } = useSWRConfig();
  const apiURL = `${env.BE_URL}/sharedWorkflow/config/upsert`;

  const upsertConfVariablesSdk = useCallback(
    async (url: string, workflowId: string, versionId: string, configVars: ConfigVar[]) => {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workflowId,
          versionId,
          configVars,
        }),
      });

      if (response.status === 403) throw new LockedWorkflowError('', response.status);
      if (`${response.status}`.startsWith('4') || `${response.status}`.startsWith('5'))
        throw new Error('Error upserting workflow config var');

      const data: ConfigVar[] = await response.json();
      return data;
    },
    [accessToken],
  );

  const upsertConfigVars = useCallback(
    async (workflowId: string, versionId: string, configVars: ConfigVar[]) => {
      const data = await mutate(
        apiURL,
        upsertConfVariablesSdk(apiURL, workflowId, versionId, configVars),
        false,
      );
      return data;
    },
    [apiURL, upsertConfVariablesSdk, mutate],
  );

  return { upsertConfigVars };
};

export const useDeleteWorkflowConfigVariables = () => {
  const { mutate } = useSWRConfig();
  const { accessToken } = useActiveUser();

  const apiURL = `${env.BE_URL}/sharedWorkflow/config/delete`;

  const deleteConfVariablesSdk = useCallback(
    async (
      url: string,
      workflowId: string,
      versionId: string,
      configVars: Record<'id', string>[],
    ) => {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workflowId,
          versionId,
          configVars,
        }),
      });
      const data = await response.json();
      if (response.status === 403) throw new LockedWorkflowError('', response.status);
      if (`${response.status}`.startsWith('4') || `${response.status}`.startsWith('5'))
        throw new Error('Error deleting workflow config var');
      return data;
    },
    [accessToken],
  );

  const deleteCofigVariables = useCallback(
    async (workflowId: string, versionId: string, configVars: Record<'id', string>[]) => {
      const data = await mutate(
        apiURL,
        deleteConfVariablesSdk(apiURL, workflowId, versionId, configVars),
        false,
      );
      return data;
    },
    [apiURL, deleteConfVariablesSdk, mutate],
  );

  return { deleteCofigVariables };
};

export const useGetAvailableSharedWorkflows = () => {
  const { accessToken } = useActiveUser();
  const apiURL = `${env.BE_URL}/sharedWorkflow/available`;
  const { data, error, isLoading, mutate } = useSWR<SharedWorkflow[]>(
    { url: apiURL, accessToken },
    getFetcherAuth,
  );

  return {
    sharedWorkflows: data,
    isLoading,
    error,
    refetch: mutate,
  };
};

export const useGetSharedWorkflowVersions = (workflowId: string | null, branch?: string) => {
  const { accessToken } = useActiveUser();
  let apiURL = workflowId ? `${env.BE_URL}/sharedWorkflow/versions/available/${workflowId}` : null;
  if (branch) {
    apiURL = addQueryParamsToString(apiURL, { currentBranch: branch });
  }
  const { data, error, isLoading, mutate } = useSWR<{ versions: TSharedWorkflowVersion[] }>(
    { url: apiURL, accessToken },
    getFetcherAuth,
  );
  return {
    versions: data?.versions,
    isLoading,
    error,
    refetch: mutate,
  };
};

export const useImportSharedWf = () => {
  const { mutate } = useSWRConfig();
  const { accessToken } = useActiveUser();
  const apiURL = `${env.BE_URL}/sharedWorkflow/import`;

  const importSharedWfSdk = useCallback(
    async (
      url: string,
      environmentName: string,
      workflowConfigFile: TConfigFile,
      importFrom: EImportType = EImportType.CLIENT,
    ) => {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          environmentName,
          workflowConfigFile,
          importFrom,
        }),
      });
      if (`${response.status}`.startsWith('4') || `${response.status}`.startsWith('5'))
        throw new Error('Error importing shared workflow');
      const data: IWorkflowConfig = await response.json();
      return data;
    },
    [accessToken],
  );

  const importSharedWf = useCallback(
    async (environmentName: string, workflowConfigFile: TConfigFile, importFrom?: EImportType) => {
      const data = await mutate(
        apiURL,
        importSharedWfSdk(apiURL, environmentName, workflowConfigFile, importFrom),
        false,
      );
      return data;
    },
    [apiURL, importSharedWfSdk, mutate],
  );

  return { importSharedWf };
};
