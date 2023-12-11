import { useCallback, useMemo } from 'react';
import { create } from 'zustand';
import { ActionType, ConnectionDataKeys, DBConnectionStore, TActionType } from './types';
import { cloneDeep } from 'lodash';
import {
  useDeleteDBConnection,
  useGetDBConnections,
  useSaveDBConnection,
} from '@services/dbConnections';
import { DBConnections, DbConnectionTypeEnum } from '@/src/types/services/dbConnections';
import { useErrorHandler } from '@hooks/errorHandlers';
import { ENVIRONMENTS } from '@/src/types/common';
import { RadioChangeEvent } from 'antd';
import { useActiveUser } from '@/src/contexts/UserProvider/hooks';

export const placeholderPassValue = '* * * * * * * *';

const escapeRegExp = (text: string) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

const defaultDb = {
  password: '',
  host: '',
  port: '',
  user: '',
  database: '',
};
const defaultDBConnection = {
  name: '',
  db_type: DbConnectionTypeEnum.POSTGRES, //? * For now we just use POSTGRES *
  connection_data: {
    sandbox: defaultDb,
    development: defaultDb,
    production: defaultDb,
  },
};

const useDbSchemaStore = create<DBConnectionStore>()((set) => ({
  isModalOpen: false,
  dbConnectionObj: defaultDBConnection,
  actionType: ActionType.CREATE,
  isLoading: false,
  selectedEnv: ENVIRONMENTS.PRODUCTION,
  setActionType: (value: TActionType) => set({ actionType: value }),
  setIsModalOpen: (value: boolean) => set({ isModalOpen: value }),
  setDbConnectionObj: (value: DBConnections) => set({ dbConnectionObj: value }),
  setIsLoading: (value: boolean) => set({ isLoading: value }),
  setSelectedEnv: (value: ENVIRONMENTS) => set({ selectedEnv: value }),
}));

export const useDBConnectionPage = () => {
  const {
    isLoading,
    actionType,
    isModalOpen,
    selectedEnv,
    dbConnectionObj,
    setIsLoading,
    setActionType,
    setSelectedEnv,
    setIsModalOpen,
    setDbConnectionObj,
  } = useDbSchemaStore();

  const { isFuseUser } = useActiveUser();
  const { createDBConnection, updateDBConnection } = useSaveDBConnection();

  const { dbConnections, refetch, isLoading: isFetchLoading } = useGetDBConnections();

  const { deleteDBConnection } = useDeleteDBConnection();
  const { handleError } = useErrorHandler();

  const environments = useMemo(() => {
    const envs = [ENVIRONMENTS.PRODUCTION, ENVIRONMENTS.SANDBOX];
    if (isFuseUser) {
      envs.push(ENVIRONMENTS.DEVELOPMENT);
    }
    return envs;
  }, [isFuseUser]);

  const handleCreate = useCallback(() => {
    setIsLoading(true);

    if (!isFuseUser) {
      const connectionCopy = cloneDeep(dbConnectionObj) as DBConnections;
      const connectionDataCopy = connectionCopy.connection_data;
      connectionDataCopy.development = connectionDataCopy.sandbox;
      setDbConnectionObj(connectionCopy);
    }

    createDBConnection(dbConnectionObj)
      .then(() => {
        setDbConnectionObj(defaultDBConnection);
        setIsModalOpen(false);
        setIsLoading(false);
        refetch();
      })
      .catch((error) => {
        setIsLoading(false);
        handleError(error, 'Error creating DB Connection, check your fields');
      });
  }, [
    isFuseUser,
    dbConnectionObj,
    refetch,
    handleError,
    setIsLoading,
    setIsModalOpen,
    createDBConnection,
    setDbConnectionObj,
  ]);

  const handleUpdate = useCallback(() => {
    setIsLoading(true);
    const connectionCopy = cloneDeep(dbConnectionObj);

    const { id, connection_data, ...rest } = connectionCopy;

    for (const key in connection_data) {
      if (connection_data[key]?.password === placeholderPassValue) {
        delete connection_data[key].password;
      }
    }

    const updatedConnection = {
      connection_data,
      ...rest,
      id,
    };

    updateDBConnection(id, updatedConnection)
      .then(() => {
        setIsModalOpen(false);
        setIsLoading(false);
        setDbConnectionObj(defaultDBConnection);
        setActionType(ActionType.CREATE);
        refetch();
      })
      .catch((error) => {
        setIsLoading(false);
        handleError(error, 'Error updating DB Connection, check your fields');
      });
  }, [
    dbConnectionObj,
    refetch,
    handleError,
    setIsLoading,
    setActionType,
    setIsModalOpen,
    setDbConnectionObj,
    updateDBConnection,
  ]);

  const getNewValue = useCallback(
    (property: ConnectionDataKeys, value: string) => {
      const { connection_data } = dbConnectionObj;

      const updatedConnection = {
        ...dbConnectionObj,
        connection_data: {
          ...connection_data,
          [selectedEnv]: {
            ...connection_data[selectedEnv],
            [property]: value,
          },
        },
      };

      return updatedConnection;
    },
    [dbConnectionObj, selectedEnv],
  );

  const handleEditConnection = useCallback(
    (property: ConnectionDataKeys, value: string) => {
      if (
        property === 'password' &&
        value !== placeholderPassValue &&
        value.includes(placeholderPassValue)
      ) {
        const escapedPlaceholder = escapeRegExp(placeholderPassValue);
        const newValue = value.replace(new RegExp(escapedPlaceholder, 'g'), '');
        const newDBConnectionObj = getNewValue(property, newValue);
        setDbConnectionObj(newDBConnectionObj);
      } else if (property === 'name') {
        setDbConnectionObj({ ...dbConnectionObj, name: value });
      } else {
        const newDBConnectionObj = getNewValue(property, value);
        setDbConnectionObj(newDBConnectionObj);
      }
    },
    [dbConnectionObj, getNewValue, setDbConnectionObj],
  );

  const handleDelete = useCallback(
    (id: string) => {
      deleteDBConnection(id).then(() => {
        refetch();
      });
    },
    [deleteDBConnection, refetch],
  );

  const setModalInUpdateMode = useCallback(
    (id: string) => {
      setActionType(ActionType.UPDATE);
      const connectionToEdit = dbConnections.find((conn) => conn.id === id);

      // TODO DELETE when update all the connections, we just use it while migrate to the new way, the following condtition will be removed

      // * for (const environment of environments) {
      // *  connectionToEdit.connection_data[environment].password = placeholderPassValue;
      // * }
      // * setDbConnectionObj(connectionToEdit);
      // * setIsModalOpen(true);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tempConnData: any = connectionToEdit?.connection_data;

      if (!tempConnData?.production || !tempConnData?.sandbox || !tempConnData?.development) {
        const tempConnection = {
          host: tempConnData.host,
          port: tempConnData?.port,
          user: tempConnData?.user,
          database: tempConnData?.database,
          password: '',
        };

        const tempConnectionToUpdate = {
          ...connectionToEdit,
          connection_data: {
            sandbox: tempConnection,
            production: tempConnection,
            development: tempConnection,
          },
        };

        setDbConnectionObj(tempConnectionToUpdate);
        setIsModalOpen(true);
      } else {
        for (const environment of environments) {
          connectionToEdit.connection_data[environment].password = placeholderPassValue;
        }

        setDbConnectionObj(connectionToEdit);
        setIsModalOpen(true);
      }
    },
    [dbConnections, environments, setActionType, setDbConnectionObj, setIsModalOpen],
  );

  const handleSave = useCallback(() => {
    switch (actionType) {
      case ActionType.CREATE:
        handleCreate();
        return;
      case ActionType.UPDATE:
        handleUpdate();
        return;
      default:
        break;
    }
  }, [actionType, handleCreate, handleUpdate]);

  const onCloseModal = useCallback(() => {
    setActionType(ActionType.CREATE);
    setDbConnectionObj(defaultDBConnection);
    setIsModalOpen(false);
  }, [setActionType, setDbConnectionObj, setIsModalOpen]);

  const handleChangeEnv = useCallback(
    (e: RadioChangeEvent) => {
      const env = e.target.value as ENVIRONMENTS;
      setSelectedEnv(env);
    },
    [setSelectedEnv],
  );

  const isCreateBtnActive = useMemo(() => {
    if (dbConnectionObj.name === '') {
      return false;
    }
    for (const environment of environments) {
      const environmentData = dbConnectionObj.connection_data[environment];
      for (const key of Object.keys(environmentData)) {
        if (environmentData[key] === '') {
          return false;
        }
      }
    }

    return true;
  }, [dbConnectionObj.connection_data, dbConnectionObj.name, environments]);

  return {
    isLoading: isLoading || isFetchLoading,
    actionType,
    isModalOpen,
    selectedEnv,
    dbConnectionObj,
    isCreateBtnActive,
    dbConnections,
    environments,
    handleSave,
    onCloseModal,
    handleDelete,
    setIsModalOpen,
    handleChangeEnv,
    setModalInUpdateMode,
    handleEditConnection,
  };
};
