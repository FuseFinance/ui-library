/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonDataEntity } from '@/src/types/services/common';
import { ChangelogWorkflow } from '@/src/types/services/changelog';
import { EnvironmentVariable } from '@/src/types/services/environmentVariables';
import { Execution } from '@/src/types/services/executions';

/* eslint-disable no-unused-vars */
export enum WorkflowStepTypeEnum {
  START = 'START',
  FORMULA = 'FORMULA',
  SPLIT_PATH = 'SPLIT_PATH',
  CONDITION = 'CONDITION',
  GO_TO_ACTION = 'GO_TO_ACTION',
  API_CALL = 'API_CALL',
  ASYNC_RESPONSE = 'ASYNC_RESPONSE',
  FINISH = 'FINISH',
  GROUP_START = 'GROUP_START',
  GROUP_END = 'GROUP_END',
  SUB_WORKFLOW = 'SUB_WORKFLOW',
  RESPONSE = 'RESPONSE',
  CUSTOM_CODE = 'CUSTOM_CODE',
  JSONATA = 'JSONATA',
  CONDITION_TABLE = 'CONDITION_TABLE',
}

export enum WorkflowStepTypeVersionEnum {
  BETA = 'BETA',
  DEPRECATED = 'DEPRECATED',
  LTS = 'LTS',
  LIMITED_SUPPORT = 'LIMITED_SUPPORT',
}

export enum BodyType {
  JSON = 'JSON',
  XML = 'XML',
  FORM_DATA = 'FORM_DATA',
  X_WWW_FORM_URLENCODED = 'X_WWW_FORM_URLENCODED',
  TEXT = 'TEXT',
  BINARY = 'BINARY',
}
export enum Formulas {
  NPER = 'NPER',
  RATE = 'RATE',
  PV = 'PV',
  PMT = 'PMT',
  MIN = 'MIN',
  MAX = 'MAX',
}

/* eslint-enable no-unused-vars */
export interface Environment {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  secrets: EnvironmentVariable;
  isProtected: boolean;
  isInternal: boolean;
  activeUser?: string | null;
  lastEditAt?: Date | null;
  environmentVersions: EnvironmentVersion[];
  changelogWorkflows: ChangelogWorkflow[];
  executions: Execution[];
}

export interface Workflow {
  name: string;
  id: string;
  client: string;
  isShared: boolean;
  hasBeenShared?: boolean;
  versionId: string;
  updatedAt: Date;
  isValid?: boolean;
}

export interface EnvironmentVersion {
  versionId: string;
  environmentName: string;
  versionSha?: string | null;
  description?: string | null;
  deployedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface IWorkflowConfig {
  id: string;
  name: string;
  steps: WorkflowStep[];
  rfData: any;
  client: string;
  secrets: EnvironmentVariable;
  versionId: string;
  variables: any;
  callbackURL: string;
  isStepsTest?: boolean;
  versionNumber: string;
  engineVersion: number;
  environmentName: string;
  isWorkflowAsync: boolean;
  successCriteria?: any;
  configurationVariables: ConfigVar[];
}

export interface WorkflowVersion {
  name?: string | null;
  workflow: IWorkflowConfig;
  githubFileSha?: string | null;
  engineVersion?: number | null;
  hasBeenShared?: boolean | null;
  workflowId: string;
  versionId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  rfData?: any | null;
}

export interface WorkflowStepTypeVersion extends CommonDataEntity {
  type: WorkflowStepTypeEnum;
  description: string;
  status: WorkflowStepTypeVersionEnum;
  versionNumber: string;
  repositoryUrl: string;
  publishedWorkflowSteps: WorkflowStep[];
}

export interface WorkflowStep extends CommonDataEntity {
  workflowId: string;
  versionId: string;
  name: string;
  type: WorkflowStepTypeEnum;
  publishedVersionId: WorkflowStepTypeVersion | null;
  inputs: any[];
  paths: JSON;
}

export interface ConfigVar extends CommonDataEntity {
  name: string | null;
  type: string | null;
  value: string | null;
  workflowId?: string;
  versionId?: string;
}

export interface RunWorkflowBody {
  body?: any;
  headers?: any;
  params?: any;
}

// * useGetWorkflows

export interface IWorkflowsEnvResponse {
  environment: Environment;
  workflows: Workflow[];
  total: number;
}

// * useGetWorkflow

export interface IWorkflowEnvResponse extends Omit<WorkflowVersion, 'workflowId'> {
  id: string;
  variables: object;
  envVarsNotFoundInWorkflow: any[];
  steps: WorkflowStep[] & { inputs: any[] };
}

// * useSave Workflow

export interface IWorkflowSaveResponse extends WorkflowVersion {
  client: string;
}
