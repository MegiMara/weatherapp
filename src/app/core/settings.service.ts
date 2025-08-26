/*import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  preferences: {
    temperatureUnit: 'celsius' | 'fahrenheit';
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    language: string;
    lastLocation?: string; // ✅ added for HomeComponent
  };
}

export interface FavoriteCity {
  id: number;
  name: string;
  country: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUser: UserProfile = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    preferences: {
      temperatureUnit: 'celsius',
      theme: 'auto',
      notifications: true,
      language: 'en',
      lastLocation: 'New York', // ✅ default
    },
  };

  private temperatureUnit$ = new BehaviorSubject<'celsius' | 'fahrenheit'>(
    this.currentUser.preferences.temperatureUnit
  );
  private notificationsEnabled$ = new BehaviorSubject<boolean>(
    this.currentUser.preferences.notifications
  );

  // ✅ Manage favorites
  private readonly FAVORITES_KEY = 'favoriteCities';

  constructor() {}

  // --- User ---
  async getCurrentUser(): Promise<UserProfile> {
    return Promise.resolve(this.currentUser);
  }

  // --- Preferences ---
  async getUserPreferences(): Promise<UserProfile['preferences']> {
    return Promise.resolve(this.currentUser.preferences);
  }

  async updateLastLocation(location: string): Promise<void> {
    this.currentUser.preferences.lastLocation = location;
    localStorage.setItem('lastLocation', location);
  }

  getTemperatureUnit(): Observable<'celsius' | 'fahrenheit'> {
    return this.temperatureUnit$.asObservable();
  }

  setTemperatureUnit(unit: 'celsius' | 'fahrenheit'): void {
    this.temperatureUnit$.next(unit);
    this.currentUser.preferences.temperatureUnit = unit;
  }

  getNotificationsEnabled(): Observable<boolean> {
    return this.notificationsEnabled$.asObservable();
  }

  setNotificationsEnabled(enabled: boolean): void {
    this.notificationsEnabled$.next(enabled);
    this.currentUser.preferences.notifications = enabled;
  }

  // --- Favorites ---
  async getFavoriteCities(): Promise<FavoriteCity[]> {
    const stored = localStorage.getItem(this.FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  async addFavoriteCity(city: Omit<FavoriteCity, 'id'>): Promise<FavoriteCity> {
    const favorites = await this.getFavoriteCities();
    const newCity: FavoriteCity = { id: Date.now(), ...city };
    favorites.push(newCity);
    localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favorites));
    return newCity;
  }

  async removeFavoriteCity(id: number): Promise<FavoriteCity[]> {
    const favorites = await this.getFavoriteCities();
    const updated = favorites.filter((city) => city.id !== id);
    localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(updated));
    return updated;
  }
}*/

import { Injectable, signal } from '@angular/core';


export type Theme = 'light' | 'dark';
export type Unit = 'C' | 'F';


@Injectable({ providedIn: 'root' })
export class SettingsService {
theme = signal<Theme>((localStorage.getItem('theme') as Theme) || 'light');
unit = signal<Unit>((localStorage.getItem('unit') as Unit) || 'C');
username = signal<string>(localStorage.getItem('username') || 'Guest');
avatarUrl = signal<string>(localStorage.getItem('avatarUrl') || 'assets/avatar.svg');


constructor() { this.applyTheme(this.theme()); }


setTheme(next: Theme) {
this.theme.set(next);
localStorage.setItem('theme', next);
this.applyTheme(next);
}


toggleTheme() {
this.setTheme(this.theme() === 'light' ? 'dark' : 'light');
}


setUnit(next: Unit) {
this.unit.set(next);
localStorage.setItem('unit', next);
}


toggleUnit() {
this.setUnit(this.unit() === 'C' ? 'F' : 'C');
}


updateProfile(username: string, avatarUrl: string) {
this.username.set(username);
this.avatarUrl.set(avatarUrl);
localStorage.setItem('username', username);
localStorage.setItem('avatarUrl', avatarUrl);
}


private applyTheme(theme: Theme) {
const body = document.body;
body.classList.remove('light-theme', 'dark-theme');
body.classList.add(theme === 'light' ? 'light-theme' : 'dark-theme');
}
}
