import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  public theme$ = new BehaviorSubject<'light' | 'dark'>(localStorage.getItem('theme') as any || 'light');
  public tempUnit$ = new BehaviorSubject<'C' | 'F'>(localStorage.getItem('tempUnit') as any || 'C');
  public notifications$ = new BehaviorSubject<boolean>(JSON.parse(localStorage.getItem('notifications') || 'true'));

  toggleTheme() {
    const newTheme = this.theme$.value === 'light' ? 'dark' : 'light';
    this.theme$.next(newTheme);
    localStorage.setItem('theme', newTheme);
  }

  toggleTempUnit() {
    const newUnit = this.tempUnit$.value === 'C' ? 'F' : 'C';
    this.tempUnit$.next(newUnit);
    localStorage.setItem('tempUnit', newUnit);
  }

  toggleNotifications() {
    const newValue = !this.notifications$.value;
    this.notifications$.next(newValue);
    localStorage.setItem('notifications', JSON.stringify(newValue));
  }
}
