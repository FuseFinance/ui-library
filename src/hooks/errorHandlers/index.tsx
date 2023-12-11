import { notification } from 'antd';
import * as Sentry from '@sentry/react';
import { useCallback } from 'react';
import { useShowNotification } from '@/src/hooks/notifications/showNotifications';
import { LockedWorkflowError } from '@/src/services/errorHandler/errorClases';
import { useLockUnlock } from '@/src/hooks/fetch-lock-unlock';
import { editingNotification, kickedOut } from '@/src/components/Notification/variants';
import env from '@/src/constants/env';

export const useSentryReport = () => {
  const reportError = useCallback((error: any) => {
    if (env.SENTRY_DSN && env.STAGE && env.STAGE !== 'local') {
      Sentry.captureException(error);
    }
  }, []);

  return { reportError };
};

export const useErrorHandler = () => {
  const { showNotificationWithNotifComponent } = useShowNotification();
  const { getLockedByNickname, setKickout } = useLockUnlock();
  const { reportError } = useSentryReport();

  const handleLockUserChange = useCallback(
    async (notifKey?: string) => {
      const errorKey = notifKey || 'locked-error';
      await setKickout();
      const nickNameToDisplay = await getLockedByNickname();
      notification.destroy(errorKey);
      showNotificationWithNotifComponent(editingNotification(nickNameToDisplay), {
        duration: 2,
      });
    },
    [getLockedByNickname, setKickout, showNotificationWithNotifComponent],
  );

  const handleLockedError = useCallback(
    async (notifKey?: string) => {
      const errorKey = notifKey || 'locked-error';
      notification.destroy(errorKey);
      const nickNameToDisplay = await getLockedByNickname();
      showNotificationWithNotifComponent(
        {
          ...kickedOut(nickNameToDisplay),
          onButtonCLick: handleLockUserChange,
        },
        {
          duration: 0,
        },
      );
    },
    [getLockedByNickname, handleLockUserChange, showNotificationWithNotifComponent],
  );

  const handleError = useCallback(async (error: any, errorMessage?: string, notifKey?: string) => {
    notification.error({
      message: errorMessage || error?.message || 'There was an unexpected error',
      placement: 'bottomRight',
      duration: 5,
      key: notifKey,
    });
  }, []);

  const handleErrorWithLockError = useCallback(
    async (error: any, errorMessage?: string, notifKey?: string) => {
      if (error instanceof LockedWorkflowError) {
        handleLockedError(notifKey);
      } else {
        handleError(error, errorMessage, notifKey);
      }

      reportError(error);
    },
    [handleError, handleLockedError, reportError],
  );

  return { handleError, handleErrorWithLockError, handleLockedError };
};
