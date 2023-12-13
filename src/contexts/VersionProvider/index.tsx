import React, { useCallback, useEffect, useState } from 'react';
import { VersionContext } from './context';
import { useGetPublishedVersions, useGetUnpublishedVersions } from '@/src/services/versions';
import { findEnvironment, findVersion } from '@/src/utils/dataFormatters';
import { useParams } from 'react-router-dom';
import { useGetEnvironments } from '@/src/services/environments';
import { useActiveUser } from '../UserProvider/hooks';
import Loader from '@/src/components/Loader';
import { FeaturedBranch } from '@/src/types/services/environment';
import { Version } from '@/src/types/services/versions';

export const VersionProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useActiveUser();
  const [publishedVersionsPage, setPublishedVersionsPage] = useState(1);
  const [unPublishedVersionsPage, setUnPublishedVersionsPage] = useState(1);
  const { versionNumber, environmentName } = useParams<{
    versionNumber: string;
    environmentName: string;
  }>();
  const {
    publishedVersions,
    totalPublishedVersions,
    isLoading,
    refetch: refetchPublishedVersions,
  } = useGetPublishedVersions(publishedVersionsPage);
  const {
    unpublishedVersions,
    totalUnpublishedVersions,
    isLoading: isLoadingUnpublishedVersions,
    refetch: refetchUnpublishedVersions,
  } = useGetUnpublishedVersions(unPublishedVersionsPage);
  const { environments, isLoading: isLoadingEnvironments } = useGetEnvironments();
  const [selectedVersion, setSelectedVersion] = useState<Version>({} as Version);
  const [selectedEnvironment, setSelectedEnvironment] = useState<FeaturedBranch>(
    {} as FeaturedBranch,
  );

  const saveSelectedVersion = useCallback((newVersion: Version) => {
    if (!newVersion?.id) return;
    setSelectedVersion(newVersion);
    localStorage.setItem('selectedVersion', JSON.stringify(newVersion));
  }, []);

  useEffect(() => {
    if (publishedVersions && publishedVersions.length > 0 && unpublishedVersions) {
      const orderedPublishedVersions = publishedVersions.sort(
        (a, b) => new Date(b.deployedAt).getTime() - new Date(a.deployedAt).getTime(),
      );
      const previousSelectedVersion = JSON.parse(localStorage.getItem('selectedVersion') || '{}');
      const versionNumberDefault = versionNumber || previousSelectedVersion?.versionNumber;
      let versionSelected = findVersion(versionNumberDefault, [
        ...orderedPublishedVersions,
        ...unpublishedVersions,
      ]);
      if (!versionSelected?.id) {
        versionSelected = orderedPublishedVersions[0];
      }
      saveSelectedVersion(versionSelected as Version);
    }
  }, [publishedVersions, unpublishedVersions, saveSelectedVersion, versionNumber]);

  useEffect(() => {
    if (environments && environments.length > 0) {
      const orderedEnvironments = environments.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      const environmentSelected = findEnvironment(
        environmentName || 'production',
        orderedEnvironments,
      );
      setSelectedEnvironment(environmentSelected as FeaturedBranch);
    }
  }, [setSelectedEnvironment, environmentName, environments]);

  if (
    isLoading ||
    isLoadingUnpublishedVersions ||
    isLoadingEnvironments ||
    !selectedVersion.id ||
    !selectedEnvironment.name
  ) {
    return <Loader />;
  }

  return (
    <VersionContext.Provider
      value={{
        versions: publishedVersions,
        totalVersions: totalPublishedVersions,
        totalUnpublishedVersions: totalUnpublishedVersions,
        versionsPage: publishedVersionsPage,
        editVersionsPage: unPublishedVersionsPage,
        featureBranches: unpublishedVersions,
        selectedVersion,
        selectedEnvironment,
        isEditing: selectedVersion.activeUser === user.sub,
        setPublishedVersionsPage,
        setUnPublishedVersionsPage,
        setSelectedVersion,
        setSelectedEnvironment,
        refetchPublishedVersions,
        refetchUnpublishedVersions,
      }}
    >
      {children}
    </VersionContext.Provider>
  );
};
