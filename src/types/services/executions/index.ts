import { Step } from '@/src/utils/types/sharedTypes';
import { IWorkflowConfig, RunWorkflowBody } from '@/src/types/services/workflows';
import { CommonDataEntity } from '@/src/types/services/common';
import { Version } from '../versions';

export interface Execution extends CommonDataEntity {
  changelogId?:string;
  stepId: string | null;
  input: RunWorkflowBody;
  workflowFile: IWorkflowConfig;
  output: JSON[];
  successCriteria: string;
  steps: Step[];
  duration: number;
  success: boolean;
  statusMessage: string;
  code: string;
  testId: string;
  successCriteriaMatched: boolean;
  workflowId?: string;
  environmentName?: string;
  versionId?: string;
  alertBlockExecuted?: boolean;
  version: Version;
  workflowVersion?: {
    workflowId: string;
    versionId: string;
    rfData: string;
    name: string;
  };
}

export interface IExecutionsResponse{
  count: number,
  executions: Execution[]
}
