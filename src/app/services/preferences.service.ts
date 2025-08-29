import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {
  private themeSubject = new BehaviorSubject<'light' | 'dark'>('light');
  private temperatureUnitSubject = new BehaviorSubject<'celsius' | 'fahrenheit'>('celsius');
  private notificationsSubject = new BehaviorSubject<boolean>(true);

  public theme$ = this.themeSubject.asObservable();
  public temperatureUnit$ = this.temperatureUnitSubject.asObservable();
  public notifications$ = this.notificationsSubject.asObservable();

  constructor() {
    this.loadPreferences();
  }

  setTheme(theme: 'light' | 'dark'): void {
    this.themeSubject.next(theme);
    localStorage.setItem('theme', theme);
    this.applyTheme(theme);
  }

  setTemperatureUnit(unit: 'celsius' | 'fahrenheit'): void {
    this.temperatureUnitSubject.next(unit);
    localStorage.setItem('temperatureUnit', unit);
  }

  setNotifications(enabled: boolean): void {
    this.notificationsSubject.next(enabled);
    localStorage.setItem('notifications', enabled.toString());
  }

  private loadPreferences(): void {
    const theme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    const temperatureUnit = localStorage.getItem('temperatureUnit') as 'celsius' | 'fahrenheit' || 'celsius';
    const notifications = localStorage.getItem('notifications') === 'true';

    this.themeSubject.next(theme);
    this.temperatureUnitSubject.next(temperatureUnit);
    this.notificationsSubject.next(notifications);
    
    this.applyTheme(theme);
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    document.documentElement.setAttribute('data-theme', theme);
  }

  convertTemperature(temp: number, unit: 'celsius' | 'fahrenheit'): number {
    if (unit === 'fahrenheit') {
      return Math.round((temp * 9/5) + 32);
    }
    return Math.round(temp);
  }
}