import { ENVIRONMENTS } from '@/src/types/common';

/* eslint-disable no-unused-vars */
export enum DbConnectionTypeEnum {
  POSTGRES = 'POSTGRES',
}

export interface DBConnectionsResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  name: string;
  db_type: DbConnectionTypeEnum;
  is_active: boolean;
  connection_data: { [key in ENVIRONMENTS]: DBConnection };
}

export interface DBConnection {
  host: string;
  port: string;
  user: string;
  password?: string;
  database: string;
}

export type DBConnections = {
  name: string;
  connection_data: { [key in ENVIRONMENTS]: DBConnection };
  key?: string;
  id?: string;
  db_type?: DbConnectionTypeEnum;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  is_active?: boolean;
};
