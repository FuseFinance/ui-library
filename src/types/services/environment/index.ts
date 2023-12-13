import { ChangelogWorkflow } from '@/src/types/services/changelog';
import { EnvironmentVariable } from '@/src/types/services/environmentVariables';
import { EnvironmentVersion } from '@/src/types/services/workflows';
import { Execution } from '@/src/types/services/executions';

// * named IEnvironmentWithVersionId in the FUSE API
export interface FeaturedBranch {
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  secrets: EnvironmentVariable;
  isProtected: boolean;
  isInternal: boolean;
  activeUser: string;
  lastEditAt: string;
  versionId: string; // aditional
  environmentVersions?: EnvironmentVersion[];
  changelogWorkflows?: ChangelogWorkflow[];
  executions?: Execution[];
}

// * useCreateBranch
export interface EnvironmentCreateBranchResponse {
  name: string;
  secrets: EnvironmentVariable;
  isProtected: boolean;
  isInternal: boolean;
}

export type Environment = {
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  secrets: EnvironmentVariable;
  isProtected: boolean;
  isInternal: boolean;
};

export type PublishedFeatureBranchesResponse = {
  featureBranches: FeaturedBranch[];
};
