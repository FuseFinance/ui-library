import { Permissions, Roles } from './types/sharedEnums';

interface IGetPermissionsResponse {
  isFuseUser: boolean;
  isFuseAdmin: boolean;
  isFuseBuilder: boolean;
  isViewer: boolean;
  isAdmin: boolean;
  isBuilder: boolean;
  canUserDeploy: boolean;
}

export const getPermissions = (role, permissions: Permissions[]): IGetPermissionsResponse => {
  // TODO: get permissions by user permissions instead of user role
  const isFuseUser = role === Roles.FUSE_ADMIN || role === Roles.FUSE_BUILDER;
  const isFuseAdmin = role === Roles.FUSE_ADMIN;
  const isFuseBuilder = role === Roles.FUSE_BUILDER;
  const isViewer = role === Roles.VIEWER;
  const isAdmin = role === Roles.ADMIN;
  const isBuilder = role === Roles.BUILDER;
  const canUserDeploy = permissions && permissions.includes(Permissions.DEPLOY_ENVIRONMENTS);

  return {
    isFuseUser,
    isFuseAdmin,
    isFuseBuilder,
    isViewer,
    isAdmin,
    isBuilder,
    canUserDeploy,
  };
};
