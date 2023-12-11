import { LockStatus } from './types';
import { useLockUnlockEnvironment } from '@/src/services/environments';
import { useVersions } from '@/src/contexts/VersionProvider/hooks';
import { useActiveUser } from '@/src/contexts/UserProvider/hooks';
import { useGetUserProfileData } from '@/src/services/users';
import { useCallback } from 'react';

export const useLockUnlock = () => {
  const { lockEnvironment, unlockEnvironment, kickoutFromEnvironment } = useLockUnlockEnvironment();
  const { selectedVersion, setSelectedVersion } = useVersions();
  const { user } = useActiveUser();
  const { getUserProfileData } = useGetUserProfileData();

  let environmentId = '';

  if (selectedVersion) {
    environmentId = selectedVersion.name;
  }

  const setLock = async () => {
    const data = await lockEnvironment(environmentId);
    setSelectedVersion({
      ...selectedVersion,
      activeUser: data.activeUser,
    });
    // localStorage.setItem('lockedVersion', environmentId)
  };

  const setUnLock = async (environmentId: string) => {
    const data = await unlockEnvironment(environmentId);
    setSelectedVersion({
      ...selectedVersion,
      activeUser: data.activeUser,
    });
    // localStorage.removeItem('lockedVersion')
  };

  const setKickout = async () => {
    await kickoutFromEnvironment(environmentId);
    await setLock();
  };

  const isLocked = () => {
    if (!selectedVersion) return false;
    if (!selectedVersion.activeUser) return false;
    if (selectedVersion.activeUser === user.sub) return false;
    return true;
  };

  const getLockStatus = (): LockStatus | null => {
    if (!selectedVersion || !user) return LockStatus.UNLOCKED;
    if (!selectedVersion || !selectedVersion.activeUser) return LockStatus.UNLOCKED;
    if (selectedVersion.activeUser === user.sub) return LockStatus.UNLOCKED;

    const storedLock = localStorage.getItem('lockedVersion');
    if (storedLock === selectedVersion.name) return LockStatus.KICKEDOUT;
    return LockStatus.LOCKED;
  };

  const getLockedByNickname = useCallback(async () => {
    if (!selectedVersion || !selectedVersion.activeUser) return null;
    const profile = await getUserProfileData(selectedVersion.activeUser);
    return profile.name;
  }, [selectedVersion, getUserProfileData]);

  return {
    setLock,
    setUnLock,
    setKickout,
    isLocked,
    getLockStatus,
    getLockedByNickname,
  };
};
