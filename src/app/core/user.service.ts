import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserProfile } from '../models/weather.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://localhost:7121/api'; // Base API URL
  private userProfileSubject = new BehaviorSubject<UserProfile | null>(null);
  public userProfile$ = this.userProfileSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserProfile();
  }

  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/User/profile`)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateProfile(profileData: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/User/profile`, profileData)
      .pipe(
        tap(updatedProfile => {
          this.userProfileSubject.next(updatedProfile);
        }),
        catchError(this.handleError)
      );
  }

  uploadAvatar(avatarFile: File): Observable<UserProfile> {
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    
    return this.http.post<UserProfile>(`${this.apiUrl}/User/avatar`, formData)
      .pipe(
        tap(updatedProfile => {
          this.userProfileSubject.next(updatedProfile);
        }),
        catchError(this.handleError)
      );
  }

  updateFavorites(cityId: number, isAdd: boolean): Observable<UserProfile> {
    const body = { cityId, action: isAdd ? 'add' : 'remove' };
    return this.http.post<UserProfile>(`${this.apiUrl}/User/favorites`, body)
      .pipe(
        tap(updatedProfile => {
          this.userProfileSubject.next(updatedProfile);
        }),
        catchError(this.handleError)
      );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/Auth/logout`, {})
      .pipe(
        tap(() => {
          // Clear user profile on successful logout
          this.userProfileSubject.next(null);
          // Clear any stored tokens
          localStorage.removeItem('authToken');
          sessionStorage.removeItem('authToken');
        }),
        catchError(this.handleError)
      );
  }

  private loadUserProfile(): void {
    // Only load profile if user is authenticated
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    
    if (token) {
      this.getUserProfile().subscribe({
        next: profile => {
          this.userProfileSubject.next(profile);
        },
        error: error => {
          console.error('Error loading user profile:', error);
          // If profile loading fails due to authentication, clear tokens
          if (error.status === 401) {
            localStorage.removeItem('authToken');
            sessionStorage.removeItem('authToken');
          }
        }
      });
    }
  }

  setUserProfile(profile: UserProfile | null): void {
    this.userProfileSubject.next(profile);
  }

  isAuthenticated(): boolean {
    return !!(localStorage.getItem('authToken') || sessionStorage.getItem('authToken'));
  }

  private handleError = (error: HttpErrorResponse) => {
    console.error('API Error:', error);
    
    let errorMessage = 'An unexpected error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = 'Bad request. Please check your input.';
          break;
        case 401:
          errorMessage = 'Authentication required. Please log in.';
          break;
        case 403:
          errorMessage = 'You do not have permission to perform this action.';
          break;
        case 404:
          errorMessage = 'The requested resource was not found.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.message}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}