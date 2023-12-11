/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonDataEntity } from '@/src/types/services/common';
import { Execution } from '@/src/types/services/executions';
import { BodyType } from '../workflows';

export interface Test extends CommonDataEntity {
  name: string;
  body: string | null;
  params: any;
  headers: any;
  payloadType: BodyType;
  successCriteria?: string | null;
  position: number | null;
  executions: Execution[];
  workflowId: string;
  folderId: string;
  stepId: string | null;
  stepsIds: string[];
  versionId: string | null;
}
