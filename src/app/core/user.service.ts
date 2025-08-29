import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { UserProfile } from '../models/weather.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api'; // Replace with your backend URL
  private userProfileSubject = new BehaviorSubject<UserProfile | null>(null);
  public userProfile$ = this.userProfileSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserProfile();
  }

  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/user/profile`);
  }

  updateFavorites(cityId: number, isAdd: boolean): Observable<UserProfile> {
    const body = { cityId, action: isAdd ? 'add' : 'remove' };
    return this.http.post<UserProfile>(`${this.apiUrl}/user/favorites`, body);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/logout`, {});
  }

  private loadUserProfile(): void {
    this.getUserProfile().subscribe(profile => {
      this.userProfileSubject.next(profile);
    });
  }

  setUserProfile(profile: UserProfile): void {
    this.userProfileSubject.next(profile);
  }
}
