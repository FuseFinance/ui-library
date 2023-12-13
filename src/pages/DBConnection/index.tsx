import { Table, Button, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import TitleHeader from '@components/TitleHeader';
import { DBConnectionModal } from './modal';
import { useDBConnectionPage } from './hooks';
import Icon from '@components/Icons';
import { IconList } from '@components/Icons/types';
import colors from '@styles/colors';
import { DBConnections } from '@/src/types/services/dbConnections';
import { useShowNotification } from '@/src/hooks/notifications/showNotifications';
import { useCallback } from 'react';

const generateTableColumns = ({
  handleDelete,
  handleEdit,
  handleCopy,
}: {
  handleDelete: (_id: string) => void;
  handleEdit: (_id: string) => void;
  handleCopy: (_id: string) => void;
}) => {
  const columns: ColumnsType<DBConnections> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Actions',
      key: 'actions',
      dataIndex: 'actions',
      width: 150,
      render: (_, row) => (
        <div className="flex gap-4">
          <Icon
            icon={IconList.Copy}
            width="1rem"
            height="1rem"
            cursor="pointer"
            fill={colors.fuseGray2}
            onClick={() => {
              handleCopy(row.id);
            }}
          />
          <Icon
            icon={IconList.Edit}
            width="1rem"
            height="1rem"
            cursor="pointer"
            fill={colors.fuseGray2}
            onClick={() => {
              handleEdit(row.id);
            }}
          />

          <Popconfirm
            title="Delete DB Connection"
            description="Are you sure you want to delete this DB Connection?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => {
              handleDelete(row.id);
            }}
          >
            <div>
              <Icon
                icon={IconList.Trash}
                width="1rem"
                height="1rem"
                cursor="pointer"
                fill={colors.fuseGray2}
              />
            </div>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return columns;
};

export default function DBConnectionPage() {
  const {
    isModalOpen,
    dbConnectionObj,
    isCreateBtnActive,
    actionType,
    isLoading,
    selectedEnv,
    environments,
    dbConnections,
    handleDelete,
    handleSave,
    setIsModalOpen,
    handleEditConnection,
    setModalInUpdateMode,
    onCloseModal,
    handleChangeEnv,
  } = useDBConnectionPage();
  const { showNotificationWithText } = useShowNotification();

  const handleCopy = useCallback(
    (id: string) => {
      navigator.clipboard.writeText(id);
      showNotificationWithText('Connection ID copied to clipboard!', {
        placement: 'topRight',
        type: 'success',
      });
    },
    [showNotificationWithText],
  );

  const columns = generateTableColumns({
    handleDelete,
    handleEdit: setModalInUpdateMode,
    handleCopy,
  });

  return (
    <div className="px-6 w-full h-screen overflow-x-scroll">
      <header className="py-8 flex justify-between">
        <TitleHeader>DB Connection</TitleHeader>
        <Button
          type="primary"
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          Add Connection
        </Button>
      </header>

      <section className="grid gap-8 ">
        <Table columns={columns} dataSource={dbConnections} loading={isLoading} />
      </section>

      {isModalOpen && (
        <DBConnectionModal
          environments={environments}
          selectedEnv={selectedEnv}
          handleChangeEnv={handleChangeEnv}
          actionType={actionType}
          onClose={onCloseModal}
          createBtnActive={isCreateBtnActive}
          isModalOpen={isModalOpen}
          handleEditConnection={handleEditConnection}
          handleSave={handleSave}
          dbConnectionObj={dbConnectionObj}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
