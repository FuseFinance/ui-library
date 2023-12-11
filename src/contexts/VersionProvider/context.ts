import { FeaturedBranch } from '@/src/types/services/environment';
import { Version } from '@/src/types/services/versions';
import React from 'react';

export interface IVersionContext {
  versions: Version[];
  totalVersions: number;
  totalUnpublishedVersions: number;
  versionsPage: number;
  editVersionsPage: number;
  featureBranches: Version[];
  selectedVersion: Version;
  selectedEnvironment: FeaturedBranch;
  isEditing: boolean;
  setPublishedVersionsPage: (_pageNumber: number) => void;
  setUnPublishedVersionsPage: (_pageNumber: number) => void;
  setSelectedVersion: (_version: Version) => void;
  setSelectedEnvironment: (_environment: FeaturedBranch) => void;
  refetchPublishedVersions: () => void;
  refetchUnpublishedVersions: () => void;
}

export const VersionContext = React.createContext<IVersionContext>({
  versions: [],
  totalVersions: 0,
  totalUnpublishedVersions: 0,
  versionsPage: null,
  editVersionsPage: null,
  featureBranches: [],
  selectedVersion: {} as Version,
  selectedEnvironment: {} as FeaturedBranch,
  isEditing: false,
  setPublishedVersionsPage: null,
  setUnPublishedVersionsPage: null,
  setSelectedVersion: null,
  setSelectedEnvironment: null,
  refetchPublishedVersions: null,
  refetchUnpublishedVersions: null,
});
