// src/app/services/notifications.service.ts
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'weather-alert';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  weatherData?: any;
  location?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private notifications = signal<Notification[]>([]);
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  
  notifications$ = this.notificationsSubject.asObservable();

  constructor() {
    this.loadInitialNotifications();
  }

  getNotifications(): Notification[] {
    return this.notifications();
  }

  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      timestamp: new Date(),
      read: false
    };
    const current = this.notifications();
    this.notifications.set([newNotification, ...current]);
    this.notificationsSubject.next(this.notifications());
  }

  markAsRead(id: string): void {
    const updated = this.notifications().map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    this.notifications.set(updated);
    this.notificationsSubject.next(this.notifications());
  }

  dismissNotification(id: string): void {
    const updated = this.notifications().filter(n => n.id !== id);
    this.notifications.set(updated);
    this.notificationsSubject.next(this.notifications());
  }

  markAllAsRead(): void {
    const updated = this.notifications().map(n => ({ ...n, read: true }));
    this.notifications.set(updated);
    this.notificationsSubject.next(this.notifications());
  }

  getUnreadCount(): number {
    return this.notifications().filter(n => !n.read).length;
  }

  addWeatherAlert(location: string, message: string, weatherData: any): void {
    this.addNotification({
      type: 'weather-alert',
      title: `Weather Alert for ${location}`,
      message,
      weatherData,
      location
    });
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private loadInitialNotifications(): void {
    const initial: Notification[] = [
      {
        id: '1',
        type: 'weather-alert',
        title: 'Severe Weather Warning',
        message: 'Heavy rain expected in your area for the next 3 hours',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: false,
        location: 'Current Location'
      },
      {
        id: '2',
        type: 'info',
        title: 'Weather Update',
        message: 'Temperature dropping to 5°C tonight in London',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        read: true,
        location: 'London'
      }
    ];
    this.notifications.set(initial);
    this.notificationsSubject.next(initial);
  }
}
