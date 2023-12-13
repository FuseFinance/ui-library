import { FeaturedBranch } from '@/src/types/services/environment';

import { Roles } from './sharedEnums';
import { PublishedVersionsResponse, Version } from '@/src/types/services/versions';

export type EditorServerSideProps = {
  selectedWorkflow: any;
  selectedVersion: FeaturedBranch | Version;
  role: Roles;
};

export type WorkflowsServersideProps = {
  selectedVersion: Version | FeaturedBranch;
  workflows: any[];
};

export type WorkflowServersideProps = {
  latestVersion: Version;
};

export type VersionServerSideProps = {
  versions: PublishedVersionsResponse;
  role: Roles;
};
