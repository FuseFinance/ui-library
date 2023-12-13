import { notification } from 'antd';
import { NotificationToastProps } from '@/src/components/Notification/types';
import NotificationToast from '@/src/components/Notification/notificationToast';

const NotificationWrapper = ({ data }: any) => {
  if (!data) return;

  return <NotificationToast {...data} />;
};

export const useShowNotification = () => {
  const showNotificationWithNotifComponent = (
    notificationData: NotificationToastProps,
    toastProps?: {
      duration?: number | false | undefined;
      key?: string;
      type?: 'success' | 'error' | 'info' | 'warning';
      placement?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | undefined;
      className?: string | undefined;
    },
  ) => {
    notification.open({
      message: <NotificationWrapper data={notificationData} />,
      placement: toastProps?.placement || 'topRight',
      className: toastProps?.className || 'notification-box',
      duration: !toastProps?.duration && toastProps?.duration !== 0 ? 5 : toastProps.duration,
      key: toastProps?.key || 'default-notification',
    });
  };

  const showNotificationWithCustomComponent = (
    NotificationComponent: React.ReactNode,
    toastProps?: {
      duration?: number | false | undefined;
      key?: string;
      type?: 'success' | 'error' | 'info' | 'warning';
      placement?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | undefined;
      className?: string | undefined;
    },
  ) => {
    notification.open({
      message: NotificationComponent,
      placement: toastProps?.placement || 'topRight',
      className: toastProps?.className || 'notification-box',
      duration: !toastProps?.duration && toastProps?.duration !== 0 ? 5 : toastProps.duration,
      key: toastProps?.key || 'default-notification',
    });
  };

  const showNotificationWithText = (
    message: string,
    toastProps?: {
      duration?: number | false | undefined;
      key?: string;
      type?: 'success' | 'error' | 'info' | 'warning';
      placement?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | undefined;
      className?: string | undefined;
    },
  ) => {
    const type = toastProps?.type || 'info';
    notification[type]({
      message,
      placement: toastProps?.placement || 'topRight',
      className: toastProps?.className || 'notification-box',
      duration: !toastProps?.duration && toastProps?.duration !== 0 ? 5 : toastProps.duration,
      key: toastProps?.key || 'default-notification',
    });
  };

  return {
    showNotificationWithNotifComponent,
    showNotificationWithCustomComponent,
    showNotificationWithText,
  };
};
