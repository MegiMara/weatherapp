import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { WeatherService } from './weather.service';
import { UserService } from '../core/user.service';

export interface WeatherAlert {
  id: string;
  cityId: number;
  cityName: string;
  type: 'temperature' | 'condition' | 'severe';
  message: string;
  timestamp: Date;
  isRead: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private notificationsEnabledSubject = new BehaviorSubject<boolean>(
    this.getStoredPreference()
  );
  public notificationsEnabled$ = this.notificationsEnabledSubject.asObservable();

  private alertsSubject = new BehaviorSubject<WeatherAlert[]>([]);
  public alerts$ = this.alertsSubject.asObservable();

  private permission: NotificationPermission = 'default';

  constructor(
    private weatherService: WeatherService,
    private userService: UserService
  ) {
    this.initializeNotifications();
    this.startWeatherMonitoring();
  }

  async enableNotifications(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (this.permission === 'granted') {
      this.setNotificationsEnabled(true);
      return true;
    }

    try {
      this.permission = await Notification.requestPermission();
      const enabled = this.permission === 'granted';
      this.setNotificationsEnabled(enabled);
      
      if (enabled) {
        this.showNotification('Weather Notifications Enabled', {
          body: 'You will now receive weather alerts for your favorite cities',
          icon: '/assets/icons/weather-icon.png'
        });
      }
      
      return enabled;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  disableNotifications(): void {
    this.setNotificationsEnabled(false);
    this.showNotification('Weather Notifications Disabled', {
      body: 'You will no longer receive weather alerts',
      icon: '/assets/icons/weather-icon.png'
    });
  }

  async toggleNotifications(): Promise<boolean> {
    const currentlyEnabled = this.notificationsEnabledSubject.value;
    
    if (!currentlyEnabled) {
      return await this.enableNotifications();
    } else {
      this.disableNotifications();
      return false;
    }
  }

  setNotificationsEnabled(enabled: boolean): void {
    this.notificationsEnabledSubject.next(enabled);
    localStorage.setItem('weather-notifications-enabled', enabled.toString());
  }

  isNotificationsEnabled(): boolean {
    return this.notificationsEnabledSubject.value;
  }

  showNotification(title: string, options?: NotificationOptions): void {
    if (!this.isNotificationsEnabled() || this.permission !== 'granted') {
      return;
    }

    const notification = new Notification(title, {
      icon: '/assets/icons/weather-icon.png',
      badge: '/assets/icons/weather-badge.png',
      ...options
    });

    // Auto close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);
  }

  addWeatherAlert(alert: Omit<WeatherAlert, 'id' | 'timestamp' | 'isRead'>): void {
    const newAlert: WeatherAlert = {
      ...alert,
      id: this.generateAlertId(),
      timestamp: new Date(),
      isRead: false
    };

    const currentAlerts = this.alertsSubject.value;
    this.alertsSubject.next([newAlert, ...currentAlerts.slice(0, 9)]); // Keep max 10 alerts

    if (this.isNotificationsEnabled()) {
      this.showNotification(`Weather Alert: ${alert.cityName}`, {
        body: alert.message,
        tag: `weather-${alert.cityId}`
      });
    }
  }

  markAlertAsRead(alertId: string): void {
    const alerts = this.alertsSubject.value.map(alert =>
      alert.id === alertId ? { ...alert, isRead: true } : alert
    );
    this.alertsSubject.next(alerts);
  }

  clearAllAlerts(): void {
    this.alertsSubject.next([]);
  }

  getUnreadAlertsCount(): Observable<number> {
    return new Observable(observer => {
      this.alerts$.subscribe(alerts => {
        const unreadCount = alerts.filter(alert => !alert.isRead).length;
        observer.next(unreadCount);
      });
    });
  }

  private initializeNotifications(): void {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  private startWeatherMonitoring(): void {
    // Monitor favorite cities for weather changes every 30 minutes
    setInterval(() => {
      if (this.isNotificationsEnabled()) {
        this.checkWeatherAlerts();
      }
    }, 30 * 60 * 1000);
  }

  private checkWeatherAlerts(): void {
    this.userService.userProfile$.subscribe(profile => {
      if (profile && profile.favoritesCities) {
        profile.favoritesCities.forEach(cityId => {
          this.weatherService.getCurrentWeather(cityId).subscribe(weather => {
            this.checkForWeatherAlerts(weather);
          });
        });
      }
    });
  }

  private checkForWeatherAlerts(weather: any): void {
    const { city, temperature, condition, id } = weather;
    
    // Temperature alerts
    if (temperature > 35) {
      this.addWeatherAlert({
        cityId: id,
        cityName: city,
        type: 'temperature',
        message: `High temperature alert: ${temperature}°C in ${city}`
      });
    } else if (temperature < -10) {
      this.addWeatherAlert({
        cityId: id,
        cityName: city,
        type: 'temperature',
        message: `Low temperature alert: ${temperature}°C in ${city}`
      });
    }

    // Severe weather conditions
    const severeConditions = ['storm', 'thunder', 'hurricane', 'tornado', 'blizzard'];
    const conditionLower = condition.toLowerCase();
    
    if (severeConditions.some(severe => conditionLower.includes(severe))) {
      this.addWeatherAlert({
        cityId: id,
        cityName: city,
        type: 'severe',
        message: `Severe weather alert: ${condition} in ${city}`
      });
    }
  }

  private getStoredPreference(): boolean {
    const stored = localStorage.getItem('weather-notifications-enabled');
    return stored ? stored === 'true' : false;
  }

  private generateAlertId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}