/* eslint-disable @typescript-eslint/no-empty-interface */

import { CommonDataEntity } from '@/src/types/services/common';
import { IWorkflowConfig } from '@/src/types/services/workflows';

export interface ChangelogWorkflow extends CommonDataEntity {
  workflowId: string;
  environmentName: string;
  description: string;
  createdBy?: string | null;
  workflow: IWorkflowConfig;
  isCurrent?: boolean | null;
}
