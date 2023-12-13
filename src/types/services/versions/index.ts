export type Version = {
  id: string;
  versionNumber: string;
  name: string;
  environment: string;
  description: string;
  deployedAt: Date;
  isProduction: boolean;
  isSandbox: boolean;
  isDevelopment: boolean;
  versionId?: string;
  activeUser?: string;
};

export type PublishedVersionsResponse = {
  versions: Version[];
  total: number;
};
