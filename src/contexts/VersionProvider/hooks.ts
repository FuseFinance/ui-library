import { useContext } from 'react';
import { VersionContext } from './context';

export const useVersions = () => {
  const {
    versions,
    versionsPage,
    editVersionsPage,
    totalVersions,
    featureBranches,
    totalUnpublishedVersions,
    selectedVersion,
    selectedEnvironment,
    isEditing,
    setPublishedVersionsPage,
    setUnPublishedVersionsPage,
    setSelectedVersion,
    setSelectedEnvironment,
    refetchPublishedVersions,
    refetchUnpublishedVersions,
  } = useContext(VersionContext);

  return {
    versions,
    totalVersions,
    editVersionsPage,
    versionsPage,
    featureBranches,
    totalUnpublishedVersions,
    selectedVersion,
    selectedEnvironment,
    isEditing,
    setPublishedVersionsPage,
    setUnPublishedVersionsPage,
    setSelectedVersion,
    setSelectedEnvironment,
    refetchPublishedVersions,
    refetchUnpublishedVersions,
  };
};
