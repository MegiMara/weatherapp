import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NotificationsService } from '../../../../services/notifications.service';

@Component({
  selector: 'app-notifications-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications-toggle.component.html',
  styleUrls: ['./notifications-toggle.component.scss']
})
export class NotificationsToggleComponent implements OnInit, OnDestroy {
  notificationsEnabled = false;
  unreadCount = 0;
  isToggling = false;
  showDropdown = false;
  private destroy$ = new Subject<void>();

  constructor(private notificationsService: NotificationsService) {}

  ngOnInit(): void {
    // Subscribe to notifications enabled state
    this.notificationsService.notificationsEnabled$
      .pipe(takeUntil(this.destroy$))
      .subscribe(enabled => {
        this.notificationsEnabled = enabled;
      });

    // Subscribe to unread alerts count
    this.notificationsService.getUnreadAlertsCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        this.unreadCount = count;
      });

    // Close dropdown when clicking outside
    document.addEventListener('click', this.onDocumentClick.bind(this));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    document.removeEventListener('click', this.onDocumentClick.bind(this));
  }

  async toggleNotifications(): Promise<void> {
    if (this.isToggling) return;
    
    this.isToggling = true;
    
    try {
      const enabled = await this.notificationsService.toggleNotifications();
      this.notificationsEnabled = enabled;
    } catch (error) {
      console.error('Error toggling notifications:', error);
    } finally {
      this.isToggling = false;
    }
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.showDropdown = !this.showDropdown;
  }

  closeDropdown(): void {
    this.showDropdown = false;
  }

  private onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const notificationContainer = target.closest('.notifications-container');
    
    if (!notificationContainer) {
      this.showDropdown = false;
    }
  }
}
