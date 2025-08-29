import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'favorites';
  private favorites$ = new BehaviorSubject<string[]>(this.loadFromStorage());

  constructor() {}

  /** Get observable for favorites list */
  getFavorites(): Observable<string[]> {
    return this.favorites$.asObservable();
  }

  /** Add a city to favorites */
  addFavorite(city: string): void {
    if (!city || this.favorites$.value.includes(city)) return;

    const updated = [...this.favorites$.value, city];
    this.favorites$.next(updated);
    this.saveToStorage(updated);

    // If backend API exists, call POST /favorites here
  }

  /** Remove a city from favorites */
  removeFavorite(city: string): void {
    const updated = this.favorites$.value.filter(c => c !== city);
    this.favorites$.next(updated);
    this.saveToStorage(updated);

    // If backend API exists, call DELETE /favorites/:city here
  }

  /** Check if city is already a favorite */
  isFavorite(city: string): boolean {
    return this.favorites$.value.includes(city);
  }

  // ------------------ Helpers ------------------
  private loadFromStorage(): string[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private saveToStorage(favorites: string[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
  }
}
