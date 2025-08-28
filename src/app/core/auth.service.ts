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


import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';

interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  subscribeNewsletter: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;

  // baza e API-së tënde backend
  private apiUrl: string = 'https://localhost:7121/api/Auth';

  constructor(private router: Router, private http: HttpClient) {}

  // REGISTER
register(payload: RegisterPayload): Observable<void> {
  return this.http.post(`${this.apiUrl}/register`, payload).pipe(
    tap(res => {
      // backend mund të kthejë direkt user ose token
      const user: User = {
        username: payload.email,
        email: payload.email,
        password: payload.password
      };

      localStorage.setItem('registeredUser', JSON.stringify(user));
      this.currentUser = user;
    }),
    map(() => void 0) // konverton Observable<any> në Observable<void>
  );
}


 login(email: string, password: string, rememberMe: boolean): Observable<void> {
    return this.http.post<{ token: string; username: string; email: string }>(
      `${this.apiUrl}/login`,
      { email, password }
    ).pipe(
      tap(res => {
        console.log(res, "rezultati")
        const user: User = {
          username: res.username ?? email,
          email: res.email ?? email,
          password // ruaj password vetëm në memorie (opsionale)
        };
        this.currentUser = user;

        // ruaj token dhe user
        if (rememberMe) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(user));
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
        } else {
          sessionStorage.setItem('token', res.token);
          sessionStorage.setItem('user', JSON.stringify(user));
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }),
       map(() => void 0) // Observable<void>
    );
  }

  // LOGOUT
  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  // Merr user nga storage
  getUser(): User | null {
    const stored = localStorage.getItem('user') || sessionStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  }

  // Merr token nga storage
  getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  // Kontrollo nëse user është loguar
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
