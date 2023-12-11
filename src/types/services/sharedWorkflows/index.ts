/* eslint-disable no-unused-vars */
import { ConfigVar } from '@/src/types/services/workflows';

export type ExtendedConfigVar = ConfigVar & {
  internalId: string;
};

export type SharedWorkflow = {
  name: string;
  workflowId: string;
  versionId: string;
  workflow: {
    id: string;
    name: string;
    client: string;
    configurationVariables: ConfigVar[];
    versionId: string;
    engineVersion: number;
    versionNumber: string;
    environmentName: string;
  };
};

export type TConfigFile = {
  id: string;
  engineVersion: number;
  isWorkflowAsync: boolean;
  callbackURL: string;
  environmentName: string;
  configurationVariables: ConfigVar[];
  versionId: string;
  versionNumber: string;
  client: string;
  name: string;
  secrets: any;
  variables: any;
  steps: any;
  rfData: any;
};

export type TSharedWorkflowVersion = {
  configFile: TConfigFile;
  isProduction: boolean;
  isCurrentVersion: boolean;
  isSandBox: boolean;
  isDevelopment: boolean;
  versionName: string;
  versionNumber: string;
  versionId: string;
};

export enum EImportType {
  JSON = 'JSON_FILE',
  CLIENT = 'CLIENT_WF',
}
