import { Test } from '@/src/types/services/tests';

export interface Folder {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  id: string;
  name: string;
  tests: Test[];
  workflowId?: string;
}
