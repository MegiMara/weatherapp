// src/app/models/notification.model.ts

export type NotificationType =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'weather-alert';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  timestamp: Date | string;
  location?: string;
}
