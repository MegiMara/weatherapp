// src/app/core/auth.service.ts
// import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
// import { User } from '../models/user.model';
// import { HttpClient } from '@angular/common/http';

// interface RegisterPayload {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   subscribeNewsletter: boolean;
// }
// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private currentUser: User | null = null;
// apiUrl: string = 'https://localhost:7121/api/Auth/login'
//   constructor(private router: Router) {}

//   async register(payload: RegisterPayload): Promise<void> {
//     console.log('Registering user:', payload);
//     const user: User = {
//       username: payload.email, // email as username
//       email: payload.email,
//       password: payload.password
//     };
//     localStorage.setItem('registeredUser', JSON.stringify(user));
//     this.currentUser = user;
//     return Promise.resolve();
//   }

//   async login(email: string, password: string, rememberMe: boolean): Promise<void> {
//     this.http.
//     const stored = localStorage.getItem('registeredUser');
//     if (!stored) throw new Error('User not found');

//     const user: User = JSON.parse(stored);
//     if (user.email === email && user.password === password) {
//       this.currentUser = user;

//       if (rememberMe) {
//         localStorage.setItem('user', JSON.stringify(user)); // persist
//         sessionStorage.removeItem('user'); // ensure no conflict
//       } else {
//         sessionStorage.setItem('user', JSON.stringify(user)); // temporary
//         localStorage.removeItem('user'); // ensure no conflict
//       }
//     } else {
//       throw new Error('Invalid email or password');
//     }
//   }

//   logout(): void {
//     this.currentUser = null;
//     localStorage.removeItem('user');
//     sessionStorage.removeItem('user');
//     this.router.navigate(['/login']);
//   }

//   getUser(): User | null {
//     const stored = localStorage.getItem('user') || sessionStorage.getItem('user');
//     return stored ? JSON.parse(stored) : null;
//   }

//   isLoggedIn(): boolean {
//     return !!this.getUser();
//   }
// }


// import { Injectable } from '@angular/core';
 
// import { Router } from '@angular/router';
// import { User } from '../models/user.model';
// import { HttpClient } from '@angular/common/http';
// import { map, Observable, tap } from 'rxjs';

// interface RegisterPayload {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   subscribeNewsletter: boolean;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private currentUser: User | null = null;

//   // baza e API-së tënde backend
//   private apiUrl: string = 'https://localhost:7121/api/Auth';

//   constructor(private router: Router, private http: HttpClient) {}

//   // REGISTER
// register(payload: RegisterPayload): Observable<void> {
//   return this.http.post(`${this.apiUrl}/register`, payload).pipe(
//     tap(res => {
//       // backend mund të kthejë direkt user ose token
//       const user: User = {
//         username: payload.email,
//         email: payload.email,
//         password: payload.password
//       };

//       localStorage.setItem('registeredUser', JSON.stringify(user));
//       this.currentUser = user;
//     }),
//     map(() => void 0) // konverton Observable<any> në Observable<void>
//   );
// }


//  login(email: string, password: string, rememberMe: boolean): Observable<void> {
//     return this.http.post<{ token: string; username: string; email: string }>(
//       `${this.apiUrl}/login`,
//       { email, password }
//     ).pipe(
//       tap(res => {
//         console.log(res, "rezultati")
//         const user: User = {
//           username: res.username ?? email,
//           email: res.email ?? email,
//           password // ruaj password vetëm në memorie (opsionale)
//         };
//         this.currentUser = user;

//         // ruaj token dhe user
//         if (rememberMe) {
//           localStorage.setItem('token', res.token);
//           localStorage.setItem('user', JSON.stringify(user));
//           sessionStorage.removeItem('token');
//           sessionStorage.removeItem('user');
//         } else {
//           sessionStorage.setItem('token', res.token);
//           sessionStorage.setItem('user', JSON.stringify(user));
//           localStorage.removeItem('token');
//           localStorage.removeItem('user');
//         }
//       }),
//        map(() => void 0) // Observable<void>
//     );
//   }

//   // LOGOUT
//   logout(): void {
//     this.currentUser = null;
//     localStorage.removeItem('user');
//     sessionStorage.removeItem('user');
//     localStorage.removeItem('token');
//     sessionStorage.removeItem('token');
//     this.router.navigate(['/login']);
//   }

//   // Merr user nga storage
//   getUser(): User | null {
//     const stored = localStorage.getItem('user') || sessionStorage.getItem('user');
//     return stored ? JSON.parse(stored) : null;
//   }

//   // Merr token nga storage
//   getToken(): string | null {
//     return localStorage.getItem('token') || sessionStorage.getItem('token');
//   }

//   // Kontrollo nëse user është loguar
//   isLoggedIn(): boolean {
//     return !!this.getToken();
//   }
// }

// src/app/core/services/auth.service.ts
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, map, tap, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

// Interface për User model
export interface User {
  id?: string;
  name: string;
  username: string;
  email: string;
  password?: string; // Vetëm për memorie, mos e ruaj në storage
  avatar?: string;
  favoriteCities: string[];
  joinDate: Date;
}

// Interface për Register payload
interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  subscribeNewsletter: boolean;
}

// Interface për Login response nga backend
interface LoginResponse {
  token: string;
  username: string;
  email: string;
  user?: any; // Nëse backend kthen user data
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USER_STORAGE_KEY = 'weather-app-user';
  private readonly TOKEN_STORAGE_KEY = 'weather-app-token';
  
  // API URL për backend
  private readonly apiUrl: string = 'https://localhost:7121/api/Auth';
  
  // BehaviorSubject për reactive user management
  private currentUserSubject = new BehaviorSubject<User | null>(this.loadUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private router: Router, 
    private http: HttpClient
  ) {
    // Initialize user nga storage nëse ekziston token
    this.initializeUser();
  }

  // ===================== REGISTRATION =====================
  register(payload: RegisterPayload): Observable<boolean> {
    return this.http.post(`${this.apiUrl}/register`, payload).pipe(
      tap((response: any) => {
        console.log('Registration successful:', response);
        
        // Krijo User object nga payload
        const user: User = {
          id: response.id || Date.now().toString(),
          name: `${payload.firstName} ${payload.lastName}`,
          username: payload.email,
          email: payload.email,
          favoriteCities: [],
          joinDate: new Date()
        };
        
        // Ruaj user në memory dhe storage (pa token ende)
        localStorage.setItem('registeredUser', JSON.stringify(user));
        console.log('User registered successfully');
      }),
      map(() => true), // Return success boolean
      catchError(this.handleError)
    );
  }

  // ===================== LOGIN =====================
  login(email: string, password: string, rememberMe: boolean = false): Observable<boolean> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      { email, password }
    ).pipe(
      tap((response: LoginResponse) => {
        console.log('Login response:', response);
        
        // Krijo User object nga response
        const user: User = {
          id: response.user?.id || Date.now().toString(),
          name: response.user?.name || response.username || email.split('@')[0],
          username: response.username || email,
          email: response.email || email,
          favoriteCities: response.user?.favoriteCities || [],
          joinDate: response.user?.joinDate ? new Date(response.user.joinDate) : new Date()
        };

        // Ruaj user dhe token në storage
        this.setCurrentUser(user);
        this.saveToken(response.token, rememberMe);
        
        console.log('User logged in successfully:', user);
      }),
      map(() => true), // Return success boolean
      catchError(this.handleError)
    );
  }

  // ===================== LOGOUT =====================
  async logout(): Promise<void> {
    try {
      // Clear user state
      this.currentUserSubject.next(null);
      
      // Clear all storage
      this.removeStoredUser();
      this.removeToken();
      
      // Navigate to login
      this.router.navigate(['/login']);
      
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // ===================== USER MANAGEMENT =====================
  getCurrentUser(): Observable<User | null> {
    return this.currentUser$;
  }

  getCurrentUserSync(): User | null {
    return this.currentUserSubject.value;
  }

  async updateProfile(updates: Partial<User>): Promise<boolean> {
    try {
      const currentUser = this.currentUserSubject.value;
      if (!currentUser) return false;

      const updatedUser = { ...currentUser, ...updates };
      this.setCurrentUser(updatedUser);
      
      // TODO: Mund të shtosh API call për të update profilin në backend
      // await this.http.put(`${this.apiUrl}/profile`, updatedUser).toPromise();
      
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      return false;
    }
  }

  // ===================== FAVORITE CITIES =====================
  async addFavoriteCity(city: string): Promise<boolean> {
    try {
      const currentUser = this.currentUserSubject.value;
      if (!currentUser) return false;

      if (!currentUser.favoriteCities.includes(city)) {
        const updatedUser = {
          ...currentUser,
          favoriteCities: [...currentUser.favoriteCities, city]
        };
        this.setCurrentUser(updatedUser);
        
        // TODO: API call për të update favorites në backend
        // await this.http.post(`${this.apiUrl}/favorites`, { city }).toPromise();
      }
      return true;
    } catch (error) {
      console.error('Add favorite city error:', error);
      return false;
    }
  }

  async removeFavoriteCity(city: string): Promise<boolean> {
    try {
      const currentUser = this.currentUserSubject.value;
      if (!currentUser) return false;

      const updatedUser = {
        ...currentUser,
        favoriteCities: currentUser.favoriteCities.filter(c => c !== city)
      };
      this.setCurrentUser(updatedUser);
      
      // TODO: API call për të hequr nga favorites në backend
      // await this.http.delete(`${this.apiUrl}/favorites/${city}`).toPromise();
      
      return true;
    } catch (error) {
      console.error('Remove favorite city error:', error);
      return false;
    }
  }

  // ===================== AUTHENTICATION STATE =====================
  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  // ===================== TOKEN MANAGEMENT =====================
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_STORAGE_KEY) || 
           sessionStorage.getItem(this.TOKEN_STORAGE_KEY);
  }

  private saveToken(token: string, rememberMe: boolean): void {
    if (rememberMe) {
      localStorage.setItem(this.TOKEN_STORAGE_KEY, token);
      sessionStorage.removeItem(this.TOKEN_STORAGE_KEY);
    } else {
      sessionStorage.setItem(this.TOKEN_STORAGE_KEY, token);
      localStorage.removeItem(this.TOKEN_STORAGE_KEY);
    }
  }

  private removeToken(): void {
    localStorage.removeItem(this.TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(this.TOKEN_STORAGE_KEY);
  }

  // ===================== USER STORAGE =====================
  private setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    this.saveUser(user);
  }

  private loadUser(): User | null {
    try {
      const stored = localStorage.getItem(this.USER_STORAGE_KEY) || 
                   sessionStorage.getItem(this.USER_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          joinDate: new Date(parsed.joinDate),
          favoriteCities: parsed.favoriteCities || []
        };
      }
    } catch (error) {
      console.warn('Failed to load user from storage:', error);
    }
    return null;
  }

  private saveUser(user: User): void {
    try {
      // Ruaj në të dyja storage për konsistencë
      const userToStore = {
        ...user,
        password: undefined // Mos ruaj password në storage
      };
      
      localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(userToStore));
    } catch (error) {
      console.warn('Failed to save user to storage:', error);
    }
  }

  private removeStoredUser(): void {
    try {
      localStorage.removeItem(this.USER_STORAGE_KEY);
      sessionStorage.removeItem(this.USER_STORAGE_KEY);
      localStorage.removeItem('registeredUser'); // Clear registration data
    } catch (error) {
      console.warn('Failed to remove user from storage:', error);
    }
  }

  // ===================== INITIALIZATION =====================
  private initializeUser(): void {
    const token = this.getToken();
    const user = this.loadUser();
    
    if (token && user) {
      // User është valid, mbaj logged in
      this.currentUserSubject.next(user);
    } else if (token && !user) {
      // Ka token por jo user data - logout
      this.logout();
    } else if (!token && user) {
      // Ka user data por jo token - logout
      this.logout();
    }
  }

  // ===================== ERROR HANDLING =====================
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'An unexpected error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend error
      switch (error.status) {
        case 400:
          errorMessage = error.error?.message || 'Invalid request';
          break;
        case 401:
          errorMessage = 'Invalid email or password';
          break;
        case 403:
          errorMessage = 'Access forbidden';
          break;
        case 404:
          errorMessage = 'Service not found';
          break;
        case 409:
          errorMessage = error.error?.message || 'Email already exists';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later';
          break;
        default:
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    
    console.error('Auth Service Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  };

  // ===================== UTILITY METHODS =====================
  getUserInitials(): string {
    const user = this.currentUserSubject.value;
    if (!user?.name) return 'U';
    
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return user.name[0].toUpperCase();
  }

  getFavoriteCities(): string[] {
    const user = this.currentUserSubject.value;
    return user?.favoriteCities || [];
  }
}