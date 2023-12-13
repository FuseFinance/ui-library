import { Step } from '@/src/utils/types/sharedTypes';
import useSWR from 'swr';
import { addQueryParamsToString } from '@/src/components/Editor/FlowCanvas/hooks';
import { IExecutionsResponse, Execution } from '@/src/types/services/executions';

export const useGetTestExecutions = (
  environmentName: string,
  testId: string,
  params: {
    fields?: string;
    page?: number;
    limit?: string;
    orderBy?: 'ASC' | 'DESC';
    filterExpression?: string;
  },
  disabledRequest?: boolean,
) => {
  const valid = environmentName && testId && !disabledRequest;
  let baseUrl;

  if (valid) {
    baseUrl = `/execution/test/${testId}/${environmentName}`;
    baseUrl = addQueryParamsToString(baseUrl, params as Record<string, string>);
  }

  const { data, error, isLoading, mutate } = useSWR<Execution[]>(valid ? baseUrl : null);

  return {
    testExecutions: data,
    isLoading,
    error,
    refetch: mutate,
  };
};

export const useGetExecutionsByWfID = ({
  environmentName,
  workflowId,
  startDate,
  endDate,
  removeFields,
  filterExpression,
  startIndex,
  limit,
  requestDisabled,
}: {
  environmentName: string;
  workflowId: string;
  startDate?: any;
  endDate?: any;
  removeFields?: string;
  filterExpression?: string;
  startIndex?: number;
  limit?: number;
  requestDisabled?: boolean;
}) => {
  const valid = !!environmentName && !!workflowId;
  let apiURL = `/execution/all/${environmentName}/${workflowId}`;
  const params: Record<any, any> = {};

  if (startDate && endDate) {
    params.startDate = startDate.toISOString();
    params.endDate = endDate.toISOString();
  }
  if (removeFields) {
    params.removeFields = removeFields;
  }
  if (filterExpression) {
    params.filterExpression = filterExpression;
  }

  params.orderBy = 'DESC';

  if (startIndex >= 0) {
    params.startIndex = JSON.stringify(startIndex);
  }

  if (limit >= 0) {
    params.limit = JSON.stringify(limit);
  }

  apiURL = addQueryParamsToString(apiURL, params);

  const { data, error, isLoading, mutate } = useSWR<IExecutionsResponse>(
    valid && !requestDisabled ? apiURL : null,
  );

  return {
    executions: data?.executions,
    total: data?.count,
    isLoading,
    error,
    refetch: mutate,
  };
};

export const useGetAllExecutions = ({
  environmentName,
  startDate,
  endDate,
  removeFields,
  filterExpression,
  startIndex,
  limit,
  requestDisabled,
}: {
  environmentName: string;
  startDate?: any;
  endDate?: any;
  removeFields?: string;
  filterExpression?: string;
  startIndex?: number;
  limit?: number;
  requestDisabled?: boolean;
}) => {
  const valid = !!environmentName;
  let apiURL = `/execution/all/${environmentName}`;
  const params: Record<any, any> = {};

  if (startDate && endDate) {
    params.startDate = startDate.toISOString();
    params.endDate = endDate.toISOString();
  }
  if (removeFields) {
    params.removeFields = removeFields;
  }
  if (filterExpression) {
    params.filterExpression = filterExpression;
  }

  params.orderBy = 'DESC';

  if (startIndex >= 0) {
    params.startIndex = startIndex;
  }
  if (limit >= 0) {
    params.limit = limit;
  }

  apiURL = addQueryParamsToString(apiURL, params);

  const { data, error, isLoading, mutate } = useSWR<IExecutionsResponse>(
    valid && !requestDisabled ? apiURL : null,
  );
  return {
    allExecutions: data?.executions,
    total: data?.count,
    isLoading,
    error,
    refetch: mutate,
  };
};

export const useGetExecutionById = ({
  executionId,
  removeFields,
}: {
  executionId: string | null;
  removeFields?: string;
}) => {
  const valid = !!executionId;
  let apiURL: string;
  if (valid) {
    apiURL = `/execution/${executionId}`;
  }
  if (removeFields) {
    apiURL += `?removeFields=${removeFields}`;
  }
  const { data, error, isLoading, mutate } = useSWR<Execution>(valid ? `${apiURL}` : null);
  return {
    execution: data,
    isLoading,
    error,
    refetch: mutate,
  };
};

export const useGetExecutionStep = ({
  executionId,
  stepId,
}: {
  executionId: string;
  stepId: string;
}) => {
  const isValid = !!executionId && !!stepId;
  const apiUrl = `/execution/${executionId}/step/${stepId}`;
  const { data, error, isLoading, mutate } = useSWR<Step>(isValid ? apiUrl : null);
  return {
    step: data,
    isLoading,
    error,
    refetch: mutate,
  };
};
