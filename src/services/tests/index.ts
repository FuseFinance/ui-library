import useSWR, { useSWRConfig } from 'swr';
import { useCallback } from 'react';
import { useActiveUser } from '@/src/contexts/UserProvider/hooks';
import env from '@constants/env';
import { Test } from '@/src/types/services/tests';
import { Execution } from '@/src/types/services/executions';
import { BodyType } from '@/src/types/services/workflows';

export const useGetTestsByWorkflowId = (
  versionId: string,
  workflowId: string,
  isPartialTest?: boolean,
) => {
  const isValid = versionId && workflowId;
  const params = isPartialTest ? '?inclStepTests=true' : '';

  const { data, error, isLoading, mutate } = useSWR<Test[]>(
    isValid ? `/test/${versionId}/workflow/${workflowId}${params}` : null,
  );

  return {
    tests: data,
    isLoading,
    error: error,
    refetch: mutate,
  };
};

export const useGetTestById = (testId: string) => {
  const { data, error, isLoading, mutate } = useSWR<Test>(testId ? `/test/${testId}` : null);
  return {
    test: data,
    isLoading,
    error: error,
    refetch: mutate,
  };
};

export const useGetTestsByStepId = (versionId: string, stepId: string) => {
  const isValid = versionId && stepId;
  const { data, error, isLoading, mutate } = useSWR<Test[]>(
    isValid ? `/test/${versionId}/blockTests/${stepId}` : null,
  );

  return {
    tests: data,
    isLoading,
    error: error,
    refetch: mutate,
  };
};

export const useTest = (payload: { workflowId?: string; testId?: string }) => {
  let apiURL: string;
  const { workflowId, testId } = payload;

  if (workflowId) {
    apiURL = `/test/${workflowId}/all`;
  }

  if (testId) {
    apiURL = `/test/${testId}`;
  }

  const { data, error, isLoading, mutate } = useSWR(apiURL);

  if (apiURL === `/test/${workflowId}/all`) {
    return {
      test: Array.isArray(data) ? data[0] : null,
      isLoading,
      error: error,
      refetch: mutate,
    };
  }

  return {
    test: data,
    isLoading,
    error: error,
    refetch: mutate,
  };
};

export const useRunTest = () => {
  const { accessToken } = useActiveUser();
  const { mutate } = useSWRConfig();
  // This could be the SDK function wrapped in a useCallback
  const runTestSdk = useCallback(
    async (
      url: string,
      data: any,
      headers: any = {},
      params: any = '',
      successCriteria: any = '',
      stepsIds?: string[],
    ) => {
      try {
        const dataParsed = typeof data !== 'string' ? JSON.stringify(data || {}, null, 2) : data;
        const requestObj = {
          body: dataParsed,
          headers: headers,
          params: params,
          successCriteria: successCriteria,
          stepsIds,
        };
        const urlToRun = `${url}`;

        const response = await fetch(urlToRun, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            ...headers,
          },
          body: JSON.stringify(requestObj),
        });
        if (!`${response.status}`.startsWith('2')) throw new Error('Error running test');
        const resp: Execution = await response.json();
        return resp;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    [accessToken],
  );

  const runTest = useCallback(
    async (
      environmentName: string,
      workflowId: string,
      data: {
        body: any;
        headers: any;
        params: any;
        successCriteria: any;
        stepsIds?: string[];
      },
      testId?: string,
    ) => {
      const apiURL = `${env.BE_URL}/test/run/${environmentName}/${workflowId}/${testId || ''}`;
      return await mutate(
        apiURL,
        runTestSdk(
          apiURL,
          data?.body,
          data?.headers,
          data?.params,
          data?.successCriteria,
          data?.stepsIds,
        ),
        false,
      );
    },
    [runTestSdk, mutate],
  );

  return {
    runTest,
  };
};

export const useCreateTest = () => {
  const { accessToken } = useActiveUser();
  const { mutate } = useSWRConfig();
  const createTestSdk = useCallback(
    async (
      url: string,
      workflowId: string,
      versionId: string,
      name: string,
      folderId: string,
      data: any,
      headers: any = {},
      params: any = {},
      successCriteria: any = '',
      stepId: string,
      position: number,
      payloadType: BodyType = BodyType.JSON,
    ) => {
      try {
        const dataParsed = typeof data !== 'string' ? JSON.stringify(data || {}, null, 2) : data;
        const requestObj = {
          workflowId,
          versionId,
          name,
          folderId,
          body: dataParsed,
          headers: headers,
          params: params,
          successCriteria: successCriteria,
          payloadType,
          position,
        };

        if (stepId && stepId !== 'null' && stepId !== 'undefined') {
          requestObj['stepId'] = stepId;
          requestObj['stepsIds'] = [stepId];
        }
        const urlToRun = `${url}`;
        const response = await fetch(urlToRun, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            ...headers,
          },
          body: JSON.stringify(requestObj),
        });
        if (!`${response.status}`.startsWith('2')) throw new Error('Error creating test');
        const resp: Test = await response.json();
        return resp;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    [accessToken],
  );

  const createTest = useCallback(
    async (
      workflowId: string,
      versionId: string,
      data: {
        name?: string;
        folderId?: string;
        body?: any;
        headers?: any;
        params?: any;
        successCriteria?: any;
        stepId?: string;
        position: number;
      },
    ) => {
      const apiURL = `${env.BE_URL}/test`;
      return await mutate(
        apiURL,
        createTestSdk(
          apiURL,
          workflowId,
          versionId,
          data.name,
          data.folderId,
          data?.body,
          data?.headers,
          data?.params,
          data?.successCriteria,
          data?.stepId,
          data.position,
        ),
        false,
      );
    },
    [createTestSdk, mutate],
  );

  return {
    createTest,
  };
};

export const useUpdateTest = () => {
  const { accessToken } = useActiveUser();
  const { mutate } = useSWRConfig();
  const updateTestSdk = useCallback(
    async (
      url: string,
      workflowId: string,
      name: string,
      folderId: string,
      data: any,
      headers: any = {},
      params: any = {},
      successCriteria: any = '',
      position?: number,
      stepsIds?: string[],
    ) => {
      try {
        const dataParsed = typeof data !== 'string' ? JSON.stringify(data || {}, null, 2) : data;
        const requestObj = {
          workflowId,
          name,
          folderId,
          body: dataParsed,
          headers: headers,
          params: params,
          successCriteria: successCriteria,
          position,
          stepsIds,
        };

        const urlToRun = `${url}`;
        const response = await fetch(urlToRun, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            ...headers,
          },
          body: JSON.stringify(requestObj),
        });
        if (!`${response.status}`.startsWith('2')) throw new Error('Error updating test');
        const resp: Test = await response.json();
        return resp;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    [accessToken],
  );

  const updateTest = useCallback(
    async (
      workflowId: string,
      data: {
        name?: string;
        folderId?: string;
        body?: any;
        headers?: any;
        params?: any;
        successCriteria?: any;
        position?: number;
        stepsIds?: string[];
      },
      testId?: string,
    ) => {
      const { name, folderId, body, headers, params, successCriteria, position, stepsIds } = data;
      const apiURL = `${env.BE_URL}/test/${testId || ''}`;
      return await mutate(
        apiURL,
        updateTestSdk(
          apiURL,
          workflowId,
          name,
          folderId,
          body,
          headers,
          params,
          successCriteria,
          position,
          stepsIds,
        ),
        false,
      );
    },
    [updateTestSdk, mutate],
  );

  return {
    updateTest,
  };
};

export const useDeleteTest = () => {
  const { accessToken } = useActiveUser();
  const { mutate } = useSWRConfig();
  const deleteTestSdk = useCallback(
    async (url: string) => {
      try {
        const urlToRun = `${url}`;
        const response = await fetch(urlToRun, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        if (!`${response.status}`.startsWith('2')) throw new Error('Error deleting test');
        return;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    [accessToken],
  );

  const deleteTest = useCallback(
    async (testId: string) => {
      const apiURL = `${env.BE_URL}/test/${testId}`;
      return await mutate(apiURL, deleteTestSdk(apiURL), false);
    },
    [deleteTestSdk, mutate],
  );

  return {
    deleteTest,
  };
};

export const useDuplicateTest = () => {
  const { accessToken } = useActiveUser();
  const { mutate } = useSWRConfig();
  const duplicateTestSdk = useCallback(
    async (url: string) => {
      try {
        const urlToRun = `${url}`;
        const response = await fetch(urlToRun, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        if (!`${response.status}`.startsWith('2')) throw new Error('Error duplicate test');
        const resp: Test = await response.json();
        return resp;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    [accessToken],
  );

  const duplicateTest = useCallback(
    async (testId: string) => {
      const apiURL = `${env.BE_URL}/test/duplicate/${testId}`;
      return await mutate(apiURL, duplicateTestSdk(apiURL), false);
    },
    [duplicateTestSdk, mutate],
  );

  return {
    duplicateTest,
  };
};
