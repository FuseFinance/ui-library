const defualtVersion = {
  deployedAt: '2023-08-04T17:06:34.136Z',
  description: 'Initial Repo setup',
  environment: 'main',
  id: '8fc919ca-f4f1-495c-a5f1-7ee07b76d657',
  isDevelopment: false,
  isProduction: false,
  isSandbox: false,
  name: 'Initial Repo setup',
  updatedAt: '2023-08-04T17:06:34.136Z',
  versionNumber: 'v.0.0.0',
};
export const selectedVersion = {
  activeUser: null,
  deployedAt: null,
  description: null,
  environment: 'test-env',
  id: '903d2f94-fa9b-4b7d-b3ca-946fee712061',
  isDevelopment: false,
  isProduction: false,
  isSandbox: false,
  name: 'mock-version',
  updatedAt: '2023-08-04T17:17:59.116Z',
  versionNumber: 'mock-version',
};

export const mockVersions = {
  selectedVersion,
  editVersionsPage: 1,
  isEditing: false,
  totalUnpublishedVersions: 1,
  totalVersions: 1,
  versions: [defualtVersion],
  versionsPage: 1,
};
