import useSWR, { useSWRConfig } from 'swr';
import { useCallback } from 'react';
import { useActiveUser } from '@/src/contexts/UserProvider/hooks';
import { INode } from '@/src/utils/types/sharedTypes';
import { useTransformWorkflow } from '@/src/components/Editor/FlowCanvas/hooks';
import { Edge } from 'reactflow';
import { LockedWorkflowError } from '@/src/services/errorHandler/errorClases';
import env from '@constants/env';
import {
  IWorkflowConfig,
  IWorkflowEnvResponse,
  IWorkflowSaveResponse,
  IWorkflowsEnvResponse,
  WorkflowVersion,
} from '@/src/types/services/workflows';
import { ChangelogWorkflow } from '@/src/types/services/changelog';

export const useGetWorkflows = (environmentNameOrVersionId: string, page?: number) => {
  const shouldFetch = !!environmentNameOrVersionId;
  const { data, error, isLoading, mutate } = useSWR<IWorkflowsEnvResponse>(
    shouldFetch
      ? `/workflow/all/version/${environmentNameOrVersionId}/${page ? `?page=${page}` : ''}`
      : null,
  );
  return {
    workflows: data?.workflows || [],
    totalWorkflows: data?.total,
    isLoading: isLoading,
    error,
    refetch: mutate,
  };
};

export const useGetAvailableSubworkflows = (
  environmentNameOrVersionId: string,
  workflowId: string,
  page?: number,
) => {
  const shouldFetch = !!environmentNameOrVersionId;
  const { data, error, isLoading, mutate } = useSWR<IWorkflowsEnvResponse>(
    shouldFetch
      ? `/workflow/subworkflows/${workflowId}/${environmentNameOrVersionId}/?limit=50${
          page ? `&page=${page}` : ''
        }`
      : null,
  );
  return {
    workflows: data?.workflows || [],
    totalWorkflows: data?.total,
    isLoading: isLoading,
    error,
    refetch: mutate,
  };
};

export const useGetWorkflowHistory = (
  environmentNameOrVersionId: string,
  workflowId: string,
  isRestoreModalOpen: boolean,
) => {
  const { data, error, isLoading, mutate } = useSWR<ChangelogWorkflow[]>(
    isRestoreModalOpen ? `/changelog/${environmentNameOrVersionId}/${workflowId}` : null,
  );
  return {
    workflowHistory: data || [],
    isLoading,
    error,
    refetch: mutate,
  };
};

export const useJumpToWorkflowHistory = () => {
  const { mutate } = useSWRConfig();
  const { accessToken } = useActiveUser();

  const jumpToHystorySdk = useCallback(
    async (url: string, changelogId: string) => {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          changelogId,
        }),
      });
      const data = await response.json();
      if (response.status === 403) throw new LockedWorkflowError(data.message, response.status);
      if (`${response.status}`.startsWith('4') || `${response.status}`.startsWith('5'))
        throw new Error(data.message);
      return data;
    },
    [accessToken],
  );

  const jumpToHystory = useCallback(
    async (changelogId: string) => {
      const apiURL = `${env.BE_URL}/changelog/jumpToHistory`;
      const data = await mutate<ChangelogWorkflow>(
        apiURL,
        jumpToHystorySdk(apiURL, changelogId),
        false,
      );
      return data;
    },
    [jumpToHystorySdk, mutate],
  );

  return {
    jumpToHystory,
  };
};

export const useGetWorkflow = (
  versionNumber: string,
  workflowId: string,
  environmentName?: string,
) => {
  let URL = null;
  if (versionNumber && workflowId && workflowId !== 'undefined' && versionNumber !== 'undefined') {
    URL = `/workflow/${workflowId}/${versionNumber}`;
  }
  if (URL && environmentName && environmentName !== 'undefined' && environmentName !== 'null') {
    URL += `/${environmentName}`;
  }
  const { data, error, isLoading, mutate } = useSWR<IWorkflowEnvResponse>(URL);
  const workflow = data
    ? {
        ...data,
        rfData: data.rfData ? (JSON.parse(data.rfData) as [INode[], Edge[]]) : undefined,
      }
    : undefined;

  return {
    workflow,
    isLoading,
    error,
    refetch: mutate,
  };
};

export const useGetWorkflowSnapshot = (
  workflowId?: string,
  versionId?: string,
  changeLogId?: string,
) => {
  let URL = '';

  if (changeLogId) {
    URL = `/changelog/id/${changeLogId}`;
  } else {
    URL = `/workflow/version/${workflowId}/${versionId}`;
  }

  const { data, error, isLoading, mutate } = useSWR(URL);

  return {
    data,
    isLoading,
    error,
    refetch: mutate,
  };
};

export const useSaveWorkflow = () => {
  const { fromReactFlowToExecutor } = useTransformWorkflow();
  const { mutate } = useSWRConfig();
  const { accessToken, isFuseUserInFuseClient } = useActiveUser();
  const apiURL = `${env.BE_URL}/workflow/save`;
  // This could be the SDK function wrapped in a useCallback
  const saveWorkflowSdk = useCallback(
    async (
      url: string,
      workflow: {
        name: string;
        environmentName: string;
        client: string;
        id?: string;
        steps?: any;
        rfData?: string;
        changeDescription?: string;
        isShared?: boolean;
      },
    ) => {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workflow),
      });
      const data: IWorkflowSaveResponse & { message: string } = await response.json();
      if (response.status === 403) throw new LockedWorkflowError(data.message, response.status);
      if (`${response.status}`.startsWith('4') || `${response.status}`.startsWith('5'))
        throw new Error(data.message);
      return data;
    },
    [accessToken],
  );

  const createWorkflow = useCallback(
    async (workflowName: string, environmentName: string, changeDescription?: string) => {
      const data = await mutate(
        apiURL,
        saveWorkflowSdk(apiURL, {
          name: workflowName,
          environmentName,
          client: env.FRONT_CLIENT,
          isShared: isFuseUserInFuseClient,
          changeDescription,
        }),
        false,
      );
      return data;
    },
    [saveWorkflowSdk, mutate, apiURL],
  );

  const updateWorkflow = useCallback(
    async (
      workflowName: string,
      environmentName: string,
      id: string,
      rfWorkflow: [INode[], Edge[]],
      changeDescription?: string,
    ) => {
      if (!id) {
        throw new Error('NO ID provided to update the workflow');
      }
      const changeDescriptionString =
        changeDescription && changeDescription !== 'undefined'
          ? changeDescription
          : `${new Date().toLocaleString()} - Workflow updated`;
      const rfData = rfWorkflow ? JSON.stringify(rfWorkflow) : undefined;
      const steps = rfWorkflow ? fromReactFlowToExecutor(rfWorkflow) : undefined;

      if (!Array.isArray(steps) || steps.length < 2) {
        throw new Error('To save a workflow, it must have at least 2 steps');
      }

      const data = await mutate(
        apiURL,
        saveWorkflowSdk(apiURL, {
          name: workflowName,
          environmentName,
          client: env.FRONT_CLIENT,
          id,
          rfData,
          steps,
          changeDescription: changeDescriptionString,
          isShared: isFuseUserInFuseClient,
        }),
        false,
      );
      return data;
    },
    [saveWorkflowSdk, mutate, apiURL, fromReactFlowToExecutor],
  );

  return {
    createWorkflow,
    updateWorkflow,
  };
};

export const useDeleteWorkflow = () => {
  const { mutate } = useSWRConfig();
  const { accessToken } = useActiveUser();
  // This could be the SDK function wrapped in a useCallback
  const deleteWorkflowSdk = useCallback(
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
        throw new Error('Error deleting workflow');
    },
    [accessToken],
  );

  const deleteWorkflow = useCallback(
    async (workflowId: string, environmentName: string) => {
      const apiURL = `${env.BE_URL}/workflow/${workflowId}/${environmentName}`;

      await mutate(apiURL, deleteWorkflowSdk(apiURL), false);
    },
    [deleteWorkflowSdk, mutate],
  );

  return {
    deleteWorkflow,
  };
};

export const useDuplicateWorkflow = () => {
  const { mutate } = useSWRConfig();
  const { accessToken } = useActiveUser();
  const apiURL = `${env.BE_URL}/workflow/duplicate`;
  // This could be the SDK function wrapped in a useCallback
  const duplicateWorkflowSdk = useCallback(
    async (url: string, workflowId: string, branchName: string) => {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workflowId,
          branchName,
        }),
      });
      const data: IWorkflowConfig & { message: string } = await response.json();
      if (response.status === 403) throw new LockedWorkflowError(data.message, response.status);
      if (`${response.status}`.startsWith('4') || `${response.status}`.startsWith('5'))
        throw new Error(data.message);

      return data;
    },
    [accessToken],
  );

  const duplicateWorkflow = useCallback(
    async (workflowId: string, environmentName: string) => {
      const data = await mutate(
        apiURL,
        duplicateWorkflowSdk(apiURL, workflowId, environmentName),
        false,
      );
      return data;
    },
    [duplicateWorkflowSdk, mutate, apiURL],
  );

  return {
    duplicateWorkflow,
  };
};

export const useRenameWorkflow = () => {
  const { mutate } = useSWRConfig();
  const { accessToken } = useActiveUser();
  const apiURL = `${env.BE_URL}/workflow/rename`;
  // This could be the SDK function wrapped in a useCallback
  const renameWorkflowSdk = useCallback(
    async (url: string, workflowId: string, versionId: string, newName: string) => {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workflowId,
          versionId,
          newName,
        }),
      });
      const data: WorkflowVersion & { message: string } = await response.json();
      if (response.status === 403) throw new LockedWorkflowError(data.message, response.status);
      if (`${response.status}`.startsWith('4') || `${response.status}`.startsWith('5'))
        throw new Error(data.message);

      return data;
    },
    [accessToken],
  );

  const renameWorkflow = useCallback(
    async (workflowId: string, versionId: string, newName: string) => {
      const data = await mutate(
        apiURL,
        renameWorkflowSdk(apiURL, workflowId, versionId, newName),
        false,
      );
      return data;
    },
    [renameWorkflowSdk, mutate, apiURL],
  );

  return {
    renameWorkflow,
  };
};

export const useExportWorkflow = () => {
  const { mutate } = useSWRConfig();
  const { accessToken } = useActiveUser();

  const exportWorkflowSdk = useCallback(
    async (url: string) => {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.status === 403) throw new LockedWorkflowError('', response.status);
      if (`${response.status}`.startsWith('4') || `${response.status}`.startsWith('5'))
        throw new Error('Error Exporting workflow');

      return data;
    },
    [accessToken],
  );

  const exportWorkflow = useCallback(
    async (workflowId: string, versionId: string, branch: string) => {
      const apiURL = `${env.BE_URL}/workflow/${workflowId}/${versionId}/${branch}/config`;

      const data = await mutate(apiURL, exportWorkflowSdk(apiURL), false);
      return data;
    },
    [exportWorkflowSdk, mutate],
  );

  return {
    exportWorkflow,
  };
};
