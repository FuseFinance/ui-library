import useSWR, { useSWRConfig } from 'swr';
import { useCallback } from 'react';
import env from '@constants/env';
import { MetadataHeaders } from './metadataHeader';
import { Scheduler } from '@/src/types/services/Scheduler';
import { IScheduledConfigRequest } from '@/src/components/Modals/CreateScheduledConfig/types';

export const useGetScheduler = (selectedEnvironmentName: string) => {
  let schedulerList: Array<Scheduler> = [];

  const { data, error, isLoading, mutate } = useSWR<any[]>('/scheduler');

  if (data) {
    schedulerList = data.map((scheduler: any) => {
      const workflowNameFromHeaders = scheduler?.httpTarget?.headers[MetadataHeaders.WORKFLOW_NAME];
      const workflowIdFromHeaders = scheduler?.httpTarget?.headers[MetadataHeaders.WORKFLOW_ID];
      const envNameFromHeaders = scheduler?.httpTarget?.headers[MetadataHeaders.ENV_NAME];

      return {
        workflowName: workflowNameFromHeaders || scheduler.name,
        schedulerId: scheduler.id,
        schedulerName: scheduler.name,
        workflowId: workflowIdFromHeaders,
        env: envNameFromHeaders,
        schedule: scheduler.schedule,
        timeZone: scheduler.timeZone,
        rawScheduler: scheduler,
      };
    });
  }

  return {
    data: schedulerList.filter((scheduler) => scheduler.env === selectedEnvironmentName),
    isLoading,
    refetch: mutate,
    error: error,
  };
};

export const useMutateScheduler = () => {
  const { mutate } = useSWRConfig();
  const accessToken = localStorage.getItem('accessToken');

  const createSchedulerSdk = useCallback(
    async (
      url: string,
      method: 'POST',
      { metadata, cronExpression, timeZone }: IScheduledConfigRequest,
    ) => {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'scheduler-wf-name': metadata.workflowName,
          'scheduler-wf-id': metadata.workflowId,
          'scheduler-env-name': metadata.environmentName,
        },
        body: JSON.stringify({ cronSchedule: cronExpression, timeZone }),
      });

      const data = await response.json();

      return data;
    },
    [accessToken],
  );

  const updateSchedulerSdk = useCallback(
    async (url: string, method: 'PUT', payload) => {
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

  const deleteSchedulerSdk = useCallback(
    async (url: string, method: 'DELETE') => {
      const response = await fetch(url, {
        method,
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

  const createScheduler = useCallback(
    async (payload: IScheduledConfigRequest) => {
      const { metadata } = payload;
      const apiURL = `${env.BE_URL}/scheduler/${metadata.environmentName}/${metadata.workflowId}/${metadata.versionId}`;

      const data = await mutate(apiURL, createSchedulerSdk(apiURL, 'POST', payload), false);
      return data;
    },
    [createSchedulerSdk, mutate],
  );

  const updateScheduler = useCallback(
    async (payload) => {
      const apiURL = `${env.BE_URL}/scheduler`;

      const data = await mutate(apiURL, updateSchedulerSdk(apiURL, 'PUT', payload), false);
      return data;
    },
    [createSchedulerSdk, mutate],
  );

  const deleteScheduler = useCallback(
    async (id: string) => {
      const apiURL = `${env.BE_URL}/scheduler/${id}`;

      const data = await mutate(apiURL, deleteSchedulerSdk(apiURL, 'DELETE'), false);
      return data;
    },
    [createSchedulerSdk, mutate],
  );

  return {
    createScheduler,
    deleteScheduler,
    updateScheduler,
  };
};
