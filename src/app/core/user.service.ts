import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface FavoriteCity {
  id: number;
  name: string;
  country: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly UNIT_KEY = 'temperatureUnit';
  private readonly FAVORITES_KEY = 'favoriteCities';
  private readonly LAST_LOCATION_KEY = 'lastLocation';

  private temperatureUnit$: BehaviorSubject<'celsius' | 'fahrenheit'>;

  constructor() {
    const savedUnit =
      (localStorage.getItem(this.UNIT_KEY) as 'celsius' | 'fahrenheit') || 'celsius';
    this.temperatureUnit$ = new BehaviorSubject<'celsius' | 'fahrenheit'>(savedUnit);

    if (!localStorage.getItem(this.FAVORITES_KEY)) {
      localStorage.setItem(this.FAVORITES_KEY, JSON.stringify([]));
    }
  }

  /** ============ Temperature Unit ============ */
  getTemperatureUnit(): Observable<'celsius' | 'fahrenheit'> {
    return this.temperatureUnit$.asObservable();
  }

  setTemperatureUnit(unit: 'celsius' | 'fahrenheit'): void {
    localStorage.setItem(this.UNIT_KEY, unit);
    this.temperatureUnit$.next(unit);
  }

  /** ============ Favorite Cities ============ */
  async getFavoriteCities(): Promise<FavoriteCity[]> {
    const data = localStorage.getItem(this.FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  }

  async addFavoriteCity(city: { name: string; country: string }): Promise<void> {
    const favorites = await this.getFavoriteCities();
    const exists = favorites.some(
      (f: FavoriteCity) => f.name.toLowerCase() === city.name.toLowerCase()
    );

    if (!exists) {
      favorites.push({ id: Date.now(), ...city });
      localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favorites));
    }
  }

  async removeFavoriteCity(id: number): Promise<void> {
    let favorites = await this.getFavoriteCities();
    favorites = favorites.filter((f: FavoriteCity) => f.id !== id);
    localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favorites));
  }

  /** ============ Last Location ============ */
  async getUserPreferences(): Promise<{ lastLocation?: string }> {
    const lastLocation = localStorage.getItem(this.LAST_LOCATION_KEY);
    return { lastLocation: lastLocation || undefined };
  }

  async updateLastLocation(location: string): Promise<void> {
    localStorage.setItem(this.LAST_LOCATION_KEY, location);
  }
}
