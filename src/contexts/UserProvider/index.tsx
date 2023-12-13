import { useEffect, useState } from 'react';
import { ActiveUserContext } from './context';
import { useGetPermissions } from '@/src/services/users';
import { getRoleByPermissions } from '@/src/utils/auth';
import { localStorageKeys } from '@/src/utils/types/localstorageKeys';

import { useAuth0 } from '@auth0/auth0-react';
import { Roles } from '@/src/utils/types/sharedEnums';

export const ActiveUserProvider = ({ children }: { children: React.ReactElement }) => {
  const accessToken = localStorage.getItem(localStorageKeys.ACCESS_TOKEN);
  const { data } = useGetPermissions();
  const { user } = useAuth0();
  const [role, setRole] = useState<Roles>();

  useEffect(() => {
    if (data) {
      setRole(getRoleByPermissions(data));
    }
  }, [data]);

  return (
    <ActiveUserContext.Provider
      value={{
        user,
        role,
        permissions: data,
        accessToken,
      }}
    >
      {children}
    </ActiveUserContext.Provider>
  );
};
