import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreferencesService } from '../../../../services/preferences.service';

@Component({
  selector: 'app-notifications-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications-toggle.component.html',
  styleUrls: ['./notifications-toggle.component.scss']
})
export class NotificationsToggleComponent implements OnInit {
  notificationsEnabled = true;

  constructor(private preferencesService: PreferencesService) {}

  ngOnInit(): void {
    this.preferencesService.notifications$.subscribe(enabled => {
      this.notificationsEnabled = enabled;
    });
  }

  toggleNotifications(): void {
    this.preferencesService.setNotifications(!this.notificationsEnabled);
  }
}

