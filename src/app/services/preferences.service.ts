import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {
  private temperatureUnitSubject = new BehaviorSubject<'celsius' | 'fahrenheit'>(
    this.getStoredTemperatureUnit()
  );
  public temperatureUnit$ = this.temperatureUnitSubject.asObservable();

  private notificationsSubject = new BehaviorSubject<boolean>(
    this.getStoredNotificationPreference()
  );
  public notifications$ = this.notificationsSubject.asObservable();

  private themeSubject = new BehaviorSubject<'light' | 'dark'>(
    this.getStoredTheme()
  );
  public theme$ = this.themeSubject.asObservable();

  constructor() {
    this.initializeTheme();
  }

  setTheme(theme: 'light' | 'dark'): void {
    this.themeSubject.next(theme);
    this.applyTheme(theme);
    localStorage.setItem('weather-app-theme', theme);
  }

  getTheme(): 'light' | 'dark' {
    return this.themeSubject.value;
  }

  toggleTheme(): void {
    const currentTheme = this.getTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  setTemperatureUnit(unit: 'celsius' | 'fahrenheit'): void {
    this.temperatureUnitSubject.next(unit);
    localStorage.setItem('weather-temperature-unit', unit);
  }

  getTemperatureUnit(): 'celsius' | 'fahrenheit' {
    return this.temperatureUnitSubject.value;
  }

  setNotifications(enabled: boolean): void {
    this.notificationsSubject.next(enabled);
    localStorage.setItem('weather-notifications-enabled', enabled.toString());
  }

  getNotifications(): boolean {
    return this.notificationsSubject.value;
  }

  convertTemperature(temp: number, toUnit: 'celsius' | 'fahrenheit'): number {
    if (typeof temp !== 'number' || isNaN(temp)) {
      return 0;
    }

    // Assume input is always in Celsius from API
    if (toUnit === 'fahrenheit') {
      return Math.round((temp * 9/5) + 32);
    }
    return Math.round(temp);
  }

  formatTemperature(temp: number, unit?: 'celsius' | 'fahrenheit'): string {
    const targetUnit = unit || this.getTemperatureUnit();
    const convertedTemp = this.convertTemperature(temp, targetUnit);
    const symbol = targetUnit === 'celsius' ? '°C' : '°F';
    return `${convertedTemp}${symbol}`;
  }

  private getStoredTemperatureUnit(): 'celsius' | 'fahrenheit' {
    const stored = localStorage.getItem('weather-temperature-unit');
    return (stored === 'fahrenheit') ? 'fahrenheit' : 'celsius';
  }

  private getStoredNotificationPreference(): boolean {
    const stored = localStorage.getItem('weather-notifications-enabled');
    return stored ? stored === 'true' : false;
  }

  // Additional preference methods can be added here
  resetAllPreferences(): void {
    localStorage.removeItem('weather-temperature-unit');
    localStorage.removeItem('weather-notifications-enabled');
    localStorage.removeItem('weather-app-theme');
    this.temperatureUnitSubject.next('celsius');
    this.notificationsSubject.next(false);
    this.themeSubject.next('light');
    this.applyTheme('light');
  }

  exportPreferences(): object {
    return {
      temperatureUnit: this.getTemperatureUnit(),
      notifications: this.getNotifications(),
      theme: this.getTheme(),
      exportDate: new Date().toISOString()
    };
  }

  importPreferences(preferences: any): boolean {
    try {
      if (preferences.temperatureUnit) {
        this.setTemperatureUnit(preferences.temperatureUnit);
      }
      if (typeof preferences.notifications === 'boolean') {
        this.setNotifications(preferences.notifications);
      }
      if (preferences.theme) {
        this.setTheme(preferences.theme);
      }
      return true;
    } catch (error) {
      console.error('Error importing preferences:', error);
      return false;
    }
  }

  private initializeTheme(): void {
    const storedTheme = this.getStoredTheme();
    this.applyTheme(storedTheme);
    
    // Listen for system theme changes
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a preference
        const hasManualPreference = localStorage.getItem('weather-app-theme');
        if (!hasManualPreference) {
          const systemTheme = e.matches ? 'dark' : 'light';
          this.setTheme(systemTheme);
        }
      });
    }
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    if (typeof document !== 'undefined') {
      // Remove existing theme classes
      document.documentElement.removeAttribute('data-theme');
      document.body.classList.remove('light-theme', 'dark-theme');
      
      // Apply new theme using data-theme attribute (matches your CSS)
      document.documentElement.setAttribute('data-theme', theme);
      document.body.classList.add(`${theme}-theme`);
      
      // Update meta theme-color for mobile browsers
      this.updateMetaThemeColor(theme);
    }
  }

  private updateMetaThemeColor(theme: 'light' | 'dark'): void {
    if (typeof document === 'undefined') return;
    
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    
    // Set theme color based on your CSS variables
    const themeColors = {
      light: '#FFFFFF', // --weather-bg-primary for light theme
      dark: '#0F172A'   // --weather-bg-primary for dark theme
    };
    
    metaThemeColor.setAttribute('content', themeColors[theme]);
  }

  private getStoredTheme(): 'light' | 'dark' {
    const stored = localStorage.getItem('weather-app-theme');
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    
    // Default to system theme or light
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }
}