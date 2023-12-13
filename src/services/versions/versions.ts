import useSWR, { useSWRConfig } from 'swr';
import { useCallback } from 'react';
import { useActiveUser } from '@/src/contexts/UserProvider/hooks';
import { LockedWorkflowError } from '../errorHandler/errorClases';
import { orderBy } from 'lodash';
import env from '@constants/env';
import { PublishedVersionsResponse, Version } from '@/src/types/services/versions';

export const getUnpublishedUrl = (page) => `/environment/unpublished/versions?page=${page}`;

export const useGetPublishedVersions = (page = 1) => {
  let publishedVersionsOrdered: Version[] = null;

  const { data, error, isLoading, mutate } = useSWR<PublishedVersionsResponse>(
    `/environment/published/versions?page=${page}`,
  );

  if (data?.versions) {
    publishedVersionsOrdered = orderBy(
      data?.versions,
      [(version) => new Date(version.deployedAt)],
      ['desc'],
    );
  }

  return {
    publishedVersions: publishedVersionsOrdered,
    totalPublishedVersions: data?.total,
    isLoading,
    error,
    refetch: mutate,
  };
};

export const useGetUnpublishedVersions = (page = 1) => {
  let unpublishedVersionsOrdered: Version[] = null;

  const { data, error, isLoading, mutate } = useSWR<PublishedVersionsResponse>(
    getUnpublishedUrl(page),
  );

  if (data?.versions) {
    unpublishedVersionsOrdered = orderBy(
      data?.versions,
      [(version) => new Date(version.updatedAt)],
      ['desc'],
    );
  }

  return {
    unpublishedVersions: unpublishedVersionsOrdered,
    totalUnpublishedVersions: data?.total,
    isLoading,
    error,
    refetch: mutate,
  };
};

export const usePublishVersion = () => {
  const { accessToken } = useActiveUser();
  const { mutate } = useSWRConfig();
  const apiURL = `${env.BE_URL}/environment/publish`;
  // This could be the SDK function wrapped in a useCallback
  const publishVersionSdk = useCallback(
    async (
      url: string,
      publishTo: string,
      versionId: string,
      description?: string,
      versionType?: string,
    ) => {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          publishTo,
          versionId,
          description,
          versionType,
        }),
      });
      if (response.status === 403) throw new LockedWorkflowError('', response.status);
      if (`${response.status}`.startsWith('4') || `${response.status}`.startsWith('5'))
        throw new Error('Error publishing version');
    },
    [accessToken],
  );

  const publishVersion = useCallback(
    async (versionId: string, versionName?: string, versionType?: string) => {
      await mutate(
        apiURL,
        publishVersionSdk(apiURL, 'main', versionId, versionName, versionType),
        false,
      );
    },
    [publishVersionSdk, mutate, apiURL],
  );

  return {
    publishVersion,
  };
};

export const useRebaseFeaturedVersion = () => {
  const { accessToken } = useActiveUser();
  const { mutate } = useSWRConfig();

  const rebaseFeaturedVersionSdk = useCallback(
    async (url: string, branch: string) => {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ baseEnvId: branch, headEnvId: 'main' }),
      });

      if (`${response.status}`.startsWith('4') || `${response.status}`.startsWith('5'))
        throw new Error('Error rebasing Version');
    },
    [accessToken],
  );

  const rebaseFeaturedVersion = useCallback(
    async (branch: string) => {
      const apiURL = `${env.BE_URL}/environment/rebase`;

      const data = await mutate(apiURL, rebaseFeaturedVersionSdk(apiURL, branch), false);
      return data;
    },
    [rebaseFeaturedVersionSdk, mutate],
  );

  return {
    rebaseFeaturedVersion,
  };
};
export const useRenameFeaturedVersion = () => {
  const { accessToken } = useActiveUser();
  const { mutate } = useSWRConfig();
  const apiURL = `${env.BE_URL}/environment/rename`;

  const renameFeaturedVersionSdk = useCallback(
    async (oldEnvironmentName: string, newEnvironmentName: string) => {
      const response = await fetch(apiURL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newEnvironmentName,
          oldEnvironmentName,
        }),
      });
      if (response.status === 403) throw new LockedWorkflowError('', response.status);
      if (`${response.status}`.startsWith('4') || `${response.status}`.startsWith('5'))
        throw new Error('Error renaming version');
    },
    [accessToken],
  );

  const renameFeaturedVersion = useCallback(
    async (oldEnvironmentName: string, newEnvironmentName: string) => {
      await mutate(apiURL, renameFeaturedVersionSdk(oldEnvironmentName, newEnvironmentName), false);
    },
    [renameFeaturedVersionSdk, mutate, apiURL],
  );

  return {
    renameFeaturedVersion,
  };
};

export const useDeleteFeaturedVersion = () => {
  const { accessToken } = useActiveUser();
  const { mutate } = useSWRConfig();
  // This could be the SDK function wrapped in a useCallback
  const deleteFeaturedVersionSdk = useCallback(
    async (url: string) => {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 403) throw new LockedWorkflowError('', response.status);
      if (`${response.status}`.startsWith('4') || `${response.status}`.startsWith('5'))
        throw new Error('Error deleting Featured Version');
    },
    [accessToken],
  );

  const deleteFeaturedVersion = useCallback(
    async (featuredVersionName: string) => {
      const apiURL = `${env.BE_URL}/environment/${featuredVersionName}`;

      await mutate(apiURL, deleteFeaturedVersionSdk(apiURL), false);
    },
    [deleteFeaturedVersionSdk, mutate],
  );

  return {
    deleteFeaturedVersion,
  };
};

export const useDeployVersion = () => {
  const { accessToken } = useActiveUser();
  const { mutate } = useSWRConfig();
  const apiURL = `${env.BE_URL}/environment/deploy`;
  // This could be the SDK function wrapped in a useCallback
  const deployVersionSdk = useCallback(
    async (url: string, environmentNames: string[], versionId: string, deployMessage?: string) => {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          environmentNames,
          versionId,
          deployMessage,
        }),
      });
      if (`${response.status}`.startsWith('4') || `${response.status}`.startsWith('5'))
        throw new Error('Error deploying version');
    },
    [accessToken],
  );

  const deployVersion = useCallback(
    async (environmentNames: string[], versionId: string, deployMessage?: string) => {
      await mutate(
        apiURL,
        deployVersionSdk(apiURL, environmentNames, versionId, deployMessage),
        false,
      );
    },
    [deployVersionSdk, mutate, apiURL],
  );

  return {
    deployVersion,
  };
};
