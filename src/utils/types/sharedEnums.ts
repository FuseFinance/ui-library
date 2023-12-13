/* eslint-disable no-unused-vars */

export enum Method {
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  GET = 'GET',
}

export enum RoutesHref {
  ROOT = '/',
  VERSIONS = '/versions',
  WORKFLOWS = '/workflows',
  EDITOR = '/editor',
  HISTORY = '/history',
  TEST = '/tests',
  VARIABLES = '/variables',
  DB_CONNECTION = '/db-connection',
  NOTIFICATIONS = '/notifications',
  SCHEDULED = '/scheduled',
}

export enum Roles {
  ADMIN = 'ADMIN',
  BUILDER = 'BUILDER',
  VIEWER = 'VIEWER',
  FUSE_ADMIN = 'FUSE_ADMIN',
  FUSE_BUILDER = 'FUSE_BUILDER',
}

export enum HTTP_METHODS {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
}

export enum Permissions {
  ADMIN_CLIENTS = 'admin:clients',
  DEPLOY_ENVIRONMENTS = 'deploy:environments',
  READ_ENVIRONMENTS = 'read:environments',
  READ_TESTS = 'read:tests',
  READ_WORKFLOWS = 'read:workflows',
  WRITE_CLIENTS = 'write:clients',
  WRITE_ENVIRONMENTS = 'write:environments',
  WRITE_TESTS = 'write:tests',
  WRITE_WORKFLOWS = 'write:workflows',
}

export const FALLBACK_USER_NICKNAME = 'An User';
export const DEFAULT_ENVIRONMENT = 'production';
export const ITEMS_PER_PAGE = 10;

export enum VersionEnvironments {
  PRODUCTION = 'production',
  SANDBOX = 'sandbox',
  DEVELOPMENT = 'development',
}
