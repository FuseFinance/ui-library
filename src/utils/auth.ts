import { Roles, Permissions } from '@/src/utils/types/sharedEnums';

const builderPermissions = [
  Permissions.READ_ENVIRONMENTS,
  Permissions.READ_TESTS,
  Permissions.READ_WORKFLOWS,
  Permissions.WRITE_ENVIRONMENTS,
  Permissions.WRITE_TESTS,
  Permissions.WRITE_WORKFLOWS,
];

const fuseBuilderPermissions = [...builderPermissions, Permissions.WRITE_CLIENTS];

export const rolesPermissions = {
  fuseBuilder: fuseBuilderPermissions,
  fuseAdmin: [...fuseBuilderPermissions, Permissions.ADMIN_CLIENTS],
  builder: builderPermissions,
  admin: [...builderPermissions, Permissions.DEPLOY_ENVIRONMENTS],
};

const checkPermissions = (userPermissions: string[], rolePermissions: string[]) => {
  return rolePermissions.every((rp) => {
    return userPermissions.includes(rp);
  });
};

export const getRoleByPermissions = (permissions: string[]): Roles => {
  if (checkPermissions(permissions, rolesPermissions.fuseAdmin)) {
    return Roles.FUSE_ADMIN;
  }

  if (checkPermissions(permissions, rolesPermissions.fuseBuilder)) {
    return Roles.FUSE_BUILDER;
  }

  if (checkPermissions(permissions, rolesPermissions.admin)) {
    return Roles.ADMIN;
  }

  if (checkPermissions(permissions, rolesPermissions.builder)) {
    return Roles.BUILDER;
  }

  return Roles.VIEWER;
};
