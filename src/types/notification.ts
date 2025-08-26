export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export interface NotificationFilters {
  type?: NotificationType;
  read?: boolean;
  search?: string;
}