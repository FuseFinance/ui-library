import styled from 'styled-components';
import tw from 'tailwind-styled-components';
import Loader from '@/src/components/Loader';
import { useEffect, useMemo, useState } from 'react';
import { useErrorHandler } from '@/src/hooks/errorHandlers';
import TitleHeader from '@/src/components/TitleHeader';
import TableNotifications from '@/src/components/TableNotifications';
import {
  useGetNotificationsConfig,
  useMutateNotificationsConfig,
} from '@/src/services/notificationsConfig';
import { UpdateNotificationConfigModal } from '@/src/components/Modals/UpdateNotificationsConfig';
import { message } from 'antd';
import { getPermissions } from '@/src/utils/permissionsHelper';
import { useActiveUser } from '@/src/contexts/UserProvider/hooks';
import { INotificationConfigRequest } from '@/src/components/Modals/UpdateNotificationsConfig/types';

const Container = styled.div``;

const HeaderContainer = tw.div`
  py-8 flex items-center justify-between
`;
const NotificationsContainer = tw.div`grid gap-8`;

export default function NotificationsConfig() {
  const {
    notificationsConfig,
    isLoading,
    refetch,
    error: envVasrError,
  } = useGetNotificationsConfig();
  const { updateEmails } = useMutateNotificationsConfig();

  const { handleError } = useErrorHandler();

  const [showUpdateNotificationConfigModal, setShowUpdateNotificationConfigModal] =
    useState<boolean>(false);
  const [selectedNotificationConfig, setSelectedNotificationConfig] = useState(null);
  const [loading, setLoading] = useState(false);

  const { role, permissions } = useActiveUser();
  const { isFuseUser } = getPermissions(role, permissions);

  const pageLoadError = useMemo(() => {
    return envVasrError;
  }, [envVasrError]);

  useEffect(() => {
    if (pageLoadError) {
      handleError(
        pageLoadError,
        'There was an error loading the notifications config',
        'envVar-error',
      );
    }
  }, [pageLoadError, handleError]);

  const handleUpdate = async (payload: INotificationConfigRequest) => {
    setLoading(true);
    try {
      const result = await updateEmails(payload.id, payload.emails);
      if (result && result.success) {
        message.success('Notification config updated!');
        refetch();
      }
    } catch (error) {
      handleError(error, 'There was an error saving the notification config', 'notification-error');
    } finally {
      setLoading(false);
      setShowUpdateNotificationConfigModal(false);
      setSelectedNotificationConfig(null);
    }
  };

  const handleSelectNotification = (notificationConfigSelected) => {
    setSelectedNotificationConfig(notificationConfigSelected);
    setShowUpdateNotificationConfigModal(true);
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <Container className="px-6" style={{ height: 'calc(100vh - 4.5rem)' }}>
        <HeaderContainer>
          <TitleHeader>{'Notifications'}</TitleHeader>
        </HeaderContainer>

        <NotificationsContainer>
          {notificationsConfig && notificationsConfig.length > 0 ? (
            <TableNotifications
              handleSelectNotification={handleSelectNotification}
              items={notificationsConfig}
              isFuseUser={isFuseUser}
            />
          ) : (
            <div className="bg-white py-16 flex flex-col items-center justify-center rounded">
              <img className="w-24 mb-4" src="/img/empty-states/empty-vars.png" alt="Empty Vars" />
              <p className="text-blue-900 font-medium text-lg">No notifications configured</p>
            </div>
          )}
        </NotificationsContainer>
      </Container>

      <UpdateNotificationConfigModal
        open={showUpdateNotificationConfigModal}
        selectedNotification={selectedNotificationConfig}
        onClose={() => {
          setSelectedNotificationConfig(null);
          setShowUpdateNotificationConfigModal(false);
        }}
        onSave={(payload) => handleUpdate(payload as any)}
        loading={loading}
      />
    </>
  );
}
