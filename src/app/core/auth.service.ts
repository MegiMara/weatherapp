// src/app/core/auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

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

  constructor(private router: Router) {}

  async register(payload: RegisterPayload): Promise<void> {
    console.log('Registering user:', payload);
    const user: User = {
      username: payload.email, // email as username
      email: payload.email,
      password: payload.password
    };
    localStorage.setItem('registeredUser', JSON.stringify(user));
    this.currentUser = user;
    return Promise.resolve();
  }

  async login(email: string, password: string, rememberMe: boolean): Promise<void> {
    const stored = localStorage.getItem('registeredUser');
    if (!stored) throw new Error('User not found');

    const user: User = JSON.parse(stored);
    if (user.email === email && user.password === password) {
      this.currentUser = user;

      if (rememberMe) {
        localStorage.setItem('user', JSON.stringify(user)); // persist
        sessionStorage.removeItem('user'); // ensure no conflict
      } else {
        sessionStorage.setItem('user', JSON.stringify(user)); // temporary
        localStorage.removeItem('user'); // ensure no conflict
      }
    } else {
      throw new Error('Invalid email or password');
    }
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  getUser(): User | null {
    const stored = localStorage.getItem('user') || sessionStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getUser();
  }
}
