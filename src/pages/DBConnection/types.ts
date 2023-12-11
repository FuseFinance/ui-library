/* eslint-disable no-unused-vars */

import { ENVIRONMENTS } from '@/src/types/common';
import { DBConnections } from '@/src/types/services/dbConnections';

export type DBConnectionStore = {
  isModalOpen: boolean;
  setIsModalOpen: (_value: boolean) => void;
  dbConnectionObj: DBConnections;
  setDbConnectionObj: (_value: DBConnections) => void;
  actionType: TActionType;
  setActionType: (_value: TActionType) => void;
  isLoading: boolean;
  setIsLoading: (_value: boolean) => void;
  selectedEnv: ENVIRONMENTS;
  setSelectedEnv: (_value: ENVIRONMENTS) => void;
};

export enum ActionType {
  CREATE = 'create',
  UPDATE = 'update',
}

export type TActionType = 'create' | 'update';

export type ConnectionDataKeys = 'password' | 'host' | 'port' | 'user' | 'database' | 'name';
