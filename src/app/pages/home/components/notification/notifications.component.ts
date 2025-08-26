// src/app/components/notifications/notifications.component.ts
import { Component, computed, Signal } from '@angular/core';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';
import { NotificationsService, Notification } from '../../../../services/notifications.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [NgFor, NgIf, AsyncPipe, CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {
  allNotifications: Signal<Notification[]>;
  unreadNotifications: Signal<Notification[]>;

  constructor(private notificationsService: NotificationsService) {
    // Convert Observable to Signal with an explicit empty array initial value
    this.allNotifications = toSignal(
      this.notificationsService.notifications$,
      { initialValue: [] as Notification[] }
    );

    // Computed signal for unread notifications
    this.unreadNotifications = computed(() =>
      this.allNotifications().filter(n => !n.read)
    );
  }

  markAsRead(notification: Notification): void {
    this.notificationsService.markAsRead(notification.id);
  }

  dismissNotification(notification: Notification): void {
    this.notificationsService.dismissNotification(notification.id);
  }

  trackById(index: number, notification: Notification): string {
    return notification.id;
  }

  formatTimestamp(timestamp: Date | string): string {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString();
  }

  getNotificationIcon(type: Notification['type']): string {
    switch (type) {
      case 'info': return 'ℹ️';
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      case 'weather-alert': return '🌤️';
      default: return '🔔';
    }
  }
}
