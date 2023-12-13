import { Input, Modal, Radio, RadioChangeEvent } from 'antd';
import { ConnectionDataKeys, TActionType } from './types';
import { placeholderPassValue } from './hooks';
import { ENVIRONMENTS } from '@/src/types/common';
import { DBConnection, DBConnections } from '@/src/types/services/dbConnections';

const InputByProperty = ({
  handleChange,
  property,
  value = '',
}: {
  handleChange: (_property: ConnectionDataKeys, _value: string) => void;
  property: ConnectionDataKeys;
  value: string;
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (property === 'password' && event.key === 'Backspace' && value === placeholderPassValue) {
      handleChange(property, '');
      event.preventDefault();
    }
  };
  return (
    <div>
      <p className="capitalize">{property}</p>
      <Input
        onKeyDown={handleKeyDown}
        value={value}
        type={property === 'port' && 'number'}
        placeholder={`insert ${property}...`}
        onChange={(e) => {
          handleChange(property, e.target.value);
        }}
      />
    </div>
  );
};

const AllTabs = ({ environments }: { environments: ENVIRONMENTS[] }) => {
  return (
    <>
      {environments.map((env) => (
        <Radio.Button key={env} value={env}>
          {env}
        </Radio.Button>
      ))}
    </>
  );
};

export const DBConnectionModal = ({
  isModalOpen,
  createBtnActive,
  actionType,
  dbConnectionObj,
  isLoading,
  selectedEnv,
  environments,
  onClose,
  handleSave,
  handleChangeEnv,
  handleEditConnection,
}: {
  isModalOpen: boolean;
  isLoading: boolean;
  actionType: TActionType;
  dbConnectionObj: DBConnections;
  createBtnActive: boolean;
  selectedEnv: ENVIRONMENTS;
  environments: ENVIRONMENTS[];
  handleEditConnection: (_property: keyof DBConnection, _value: string) => void;
  handleChangeEnv: (_value: RadioChangeEvent) => void;
  onClose: () => void;
  handleSave: () => void;
}) => {
  const { database, host, port, user, password } = dbConnectionObj.connection_data[selectedEnv];
  const actionText = actionType === 'create' ? 'Create' : 'Update';

  return (
    <Modal
      title={`${actionText} DB Connection`}
      open={isModalOpen}
      onOk={handleSave}
      okButtonProps={{ disabled: !createBtnActive, loading: isLoading }}
      onCancel={onClose}
      okText={actionText}
      centered
    >
      <div className="grid gap-4">
        <InputByProperty
          handleChange={handleEditConnection}
          property="name"
          value={dbConnectionObj.name}
        />

        <p>Environment</p>
        <Radio.Group className="capitalize" onChange={handleChangeEnv} value={selectedEnv}>
          <AllTabs environments={environments} />
        </Radio.Group>

        <InputByProperty handleChange={handleEditConnection} property="host" value={host} />
        <InputByProperty handleChange={handleEditConnection} property="port" value={port} />
        <InputByProperty handleChange={handleEditConnection} property="user" value={user} />
        <InputByProperty handleChange={handleEditConnection} property="password" value={password} />
        <InputByProperty handleChange={handleEditConnection} property="database" value={database} />
      </div>
    </Modal>
  );
};
