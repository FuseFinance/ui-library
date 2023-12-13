import { getPermissions } from '@/src/utils/permissionsHelper';
import { useContext } from 'react';
import { ActiveUserContext } from './context';
import env from '@constants/env';
export const useActiveUser = () => {
  const { user, role, permissions, accessToken } = useContext(ActiveUserContext);
  const { isFuseUser } = getPermissions(role, permissions);
  const currentClient = env.FRONT_CLIENT;

  const isFUFC = (): boolean => {
    if (currentClient && currentClient.toLowerCase().includes('fuse') && isFuseUser) return true;
    return false;
  };

  const isFUAC = (): boolean => {
    if (currentClient && !currentClient.toLowerCase().includes('fuse') && isFuseUser) return true;
    return false;
  };

  return {
    user,
    role,
    permissions,
    accessToken,
    currentClient,
    isFuseUserInFuseClient: isFUFC(),
    isFuseUserAnyClient: isFUAC(),
    isFuseUser,
  };
};
