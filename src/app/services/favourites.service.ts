// src/app/services/favourites.service.ts
// src/app/services/favourites.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
// import { AppConfigService } from '../config/app-config.service';

export interface FavoriteCity {
  id: string;
  name: string;
  country: string;
  addedAt: Date;
  userId?: string;
}

export interface AddFavoriteCityRequest {
  name: string;
  country: string;
}

@Injectable({
  providedIn: 'root'
})
export class FavouritesService {
  // private http = inject(HttpClient);
  // // private configService = inject(AppConfigService);
  // // private baseUrl = `${this.configService.apiUrl}/favorites`;
  
  // // State management
  // private favoritesSubject = new BehaviorSubject<FavoriteCity[]>([]);
  // private loadingSubject = new BehaviorSubject<boolean>(false);
  
  // // Public observables
  // public readonly favorites$ = this.favoritesSubject.asObservable();
  // public readonly loading$ = this.loadingSubject.asObservable();

  // constructor() {
  //   this.loadFavoritesFromCache();
  }

  /**
   * Get all user's favorite cities
   */
//   getFavorites(): Observable<FavoriteCity[]> {
//     this.setLoading(true);

//     return this.http.get<{
//       success: boolean;
//       favorites: any[];
//       message?: string;
//     }>(`${this.baseUrl}`, {
//       headers: this.getAuthHeaders()
//     }).pipe(
//       map(response => {
//         if (response.success) {
//           const favorites = response.favorites.map(fav => ({
//             id: fav.id,
//             name: fav.name,
//             country: fav.country,
//             addedAt: new Date(fav.addedAt),
//             userId: fav.userId
//           }));
          
//           this.updateFavorites(favorites);
//           this.saveFavoritesToCache(favorites);
//           return favorites;
//         } else {
//           throw new Error(response.message || 'Failed to fetch favorites');
//         }
//       }),
//       catchError(error => {
//         console.error('Failed to load favorites:', error);
//         // Return cached data on error
//         const cachedFavorites = this.favoritesSubject.value;
//         if (cachedFavorites.length > 0) {
//           return of(cachedFavorites);
//         }
//         return throwError(() => error);
//       }),
//       tap(() => this.setLoading(false))
//     );
//   }

//   /**
//    * Add a city to favorites
//    */
//   addFavorite(cityData: AddFavoriteCityRequest): Observable<FavoriteCity> {
//     if (!cityData.name || !cityData.country) {
//       return throwError(() => new Error('City name and country are required'));
//     }

//     // Check if already exists
//     if (this.isFavorite(cityData.name, cityData.country)) {
//       return throwError(() => new Error('This city is already in your favorites'));
//     }

//     this.setLoading(true);

//     return this.http.post<{
//       success: boolean;
//       favorite: any;
//       message?: string;
//     }>(`${this.baseUrl}`, cityData, {
//       headers: this.getAuthHeaders()
//     }).pipe(
//       map(response => {
//         if (response.success) {
//           const newFavorite: FavoriteCity = {
//             id: response.favorite.id,
//             name: response.favorite.name,
//             country: response.favorite.country,
//             addedAt: new Date(response.favorite.addedAt),
//             userId: response.favorite.userId
//           };
          
//           // Add to local state
//           const currentFavorites = this.favoritesSubject.value;
//           const updatedFavorites = [...currentFavorites, newFavorite];
//           this.updateFavorites(updatedFavorites);
//           this.saveFavoritesToCache(updatedFavorites);
          
//           return newFavorite;
//         } else {
//           throw new Error(response.message || 'Failed to add favorite');
//         }
//       }),
//       catchError(error => {
//         console.error('Failed to add favorite:', error);
//         const errorMessage = error?.error?.message || error?.message || 'Failed to add favorite';
//         return throwError(() => new Error(errorMessage));
//       }),
//       tap(() => this.setLoading(false))
//     );
//   }

//   /**
//    * Remove a city from favorites
//    */
//   removeFavorite(favoriteId: string): Observable<boolean> {
//     if (!favoriteId) {
//       return throwError(() => new Error('Favorite ID is required'));
//     }

//     this.setLoading(true);

//     // Optimistically remove from UI
//     const currentFavorites = this.favoritesSubject.value;
//     const optimisticFavorites = currentFavorites.filter(fav => fav.id !== favoriteId);
//     this.updateFavorites(optimisticFavorites);

//     return this.http.delete<{
//       success: boolean;
//       message?: string;
//     }>(`${this.baseUrl}/${favoriteId}`, {
//       headers: this.getAuthHeaders()
//     }).pipe(
//       map(response => {
//         if (response.success) {
//           this.saveFavoritesToCache(optimisticFavorites);
//           return true;
//         } else {
//           // Revert optimistic update
//           this.updateFavorites(currentFavorites);
//           throw new Error(response.message || 'Failed to remove favorite');
//         }
//       }),
//       catchError(error => {
//         // Revert optimistic update
//         this.updateFavorites(currentFavorites);
//         console.error('Failed to remove favorite:', error);
//         const errorMessage = error?.error?.message || error?.message || 'Failed to remove favorite';
//         return throwError(() => new Error(errorMessage));
//       }),
//       tap(() => this.setLoading(false))
//     );
//   }

//   /**
//    * Check if a city is already in favorites
//    */
//   isFavorite(cityName: string, country: string): boolean {
//     const favorites = this.favoritesSubject.value;
//     return favorites.some(fav => 
//       fav.name.toLowerCase() === cityName.toLowerCase() &&
//       fav.country.toLowerCase() === country.toLowerCase()
//     );
//   }

//   /**
//    * Get favorite by city name and country
//    */
//   getFavoriteByNameAndCountry(cityName: string, country: string): FavoriteCity | null {
//     const favorites = this.favoritesSubject.value;
//     return favorites.find(fav => 
//       fav.name.toLowerCase() === cityName.toLowerCase() &&
//       fav.country.toLowerCase() === country.toLowerCase()
//     ) || null;
//   }

//   /**
//    * Get favorites count
//    */
//   getFavoritesCount(): number {
//     return this.favoritesSubject.value.length;
//   }

//   /**
//    * Search favorites by name
//    */
//   searchFavorites(query: string): FavoriteCity[] {
//     if (!query.trim()) {
//       return this.favoritesSubject.value;
//     }

//     return this.favoritesSubject.value.filter(fav => 
//       fav.name.toLowerCase().includes(query.toLowerCase()) ||
//       fav.country.toLowerCase().includes(query.toLowerCase())
//     );
//   }

//   /**
//    * Clear all favorites
//    */
//   clearAllFavorites(): Observable<boolean> {
//     this.setLoading(true);

//     return this.http.delete<{
//       success: boolean;
//       message?: string;
//     }>(`${this.baseUrl}/all`, {
//       headers: this.getAuthHeaders()
//     }).pipe(
//       map(response => {
//         if (response.success) {
//           this.updateFavorites([]);
//           this.clearFavoritesFromCache();
//           return true;
//         } else {
//           throw new Error(response.message || 'Failed to clear favorites');
//         }
//       }),
//       catchError(error => {
//         console.error('Failed to clear favorites:', error);
//         const errorMessage = error?.error?.message || error?.message || 'Failed to clear favorites';
//         return throwError(() => new Error(errorMessage));
//       }),
//       tap(() => this.setLoading(false))
//     );
//   }

//   // Private helper methods

//   private updateFavorites(favorites: FavoriteCity[]): void {
//     this.favoritesSubject.next(favorites);
//   }

//   private setLoading(loading: boolean): void {
//     this.loadingSubject.next(loading);
//   }

//   private getAuthHeaders(): HttpHeaders {
//     const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
//     const headers: any = {
//       'Content-Type': 'application/json'
//     };
    
//     if (token) {
//       headers['Authorization'] = `Bearer ${token}`;
//     }
    
//     return new HttpHeaders(headers);
//   }

//   // Cache management for offline support

//   private saveFavoritesToCache(favorites: FavoriteCity[]): void {
//     try {
//       const favoritesToStore = favorites.map(fav => ({
//         id: fav.id,
//         name: fav.name,
//         country: fav.country,
//         addedAt: fav.addedAt.toISOString(),
//         userId: fav.userId
//       }));
//       localStorage.setItem('userFavorites', JSON.stringify(favoritesToStore));
//     } catch (error) {
//       console.warn('Failed to cache favorites:', error);
//     }
//   }

//   private loadFavoritesFromCache(): void {
//     try {
//       const stored = localStorage.getItem('userFavorites');
//       if (stored) {
//         const favorites = JSON.parse(stored).map((fav: any) => ({
//           id: fav.id,
//           name: fav.name,
//           country: fav.country,
//           addedAt: new Date(fav.addedAt),
//           userId: fav.userId
//         }));
//         this.updateFavorites(favorites);
//       }
//     } catch (error) {
//       console.warn('Failed to load cached favorites:', error);
//     }
//   }

//   private clearFavoritesFromCache(): void {
//     try {
//       localStorage.removeItem('userFavorites');
//     } catch (error) {
//       console.warn('Failed to clear favorites cache:', error);
//     }
//   }
// }