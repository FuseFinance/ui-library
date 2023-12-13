import React from 'react';
import { Roles, Permissions } from '@/src/utils/types/sharedEnums';
import { User } from '@/src/types/services/users';

export interface IActiveUserContext {
  user: User;
  role: Roles;
  permissions: Permissions[];
  accessToken: string;
}

export const ActiveUserContext = React.createContext<IActiveUserContext>({
  user: null,
  role: null,
  permissions: [],
  accessToken: null,
});
