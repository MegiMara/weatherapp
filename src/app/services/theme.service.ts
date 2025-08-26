 import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark' | 'auto';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private currentTheme$ = new BehaviorSubject<Theme>('auto');

  /** Observable for dark mode (true if dark theme active) */
  public isDarkTheme$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.loadTheme();
  }

  /** Set theme */
  setTheme(theme: Theme): void {
    this.currentTheme$.next(theme);
    localStorage.setItem('appTheme', theme);
    this.applyTheme(theme);
  }

  /** Get current theme (synchronous) */
  getCurrentTheme(): Theme {
    return this.currentTheme$.value;
  }

  /** Load saved theme from localStorage */
  loadTheme(): void {
    const savedTheme = localStorage.getItem('appTheme') as Theme | null;
    const theme = savedTheme || 'auto';
    this.setTheme(theme);
  }

  /** Apply theme to document body */
  private applyTheme(theme: Theme): void {
    const body = document.body;
    body.classList.remove('light', 'dark');

    let darkActive = false;

    if (theme === 'light') {
      body.classList.add('light');
      darkActive = false;
    } else if (theme === 'dark') {
      body.classList.add('dark');
      darkActive = true;
    } else {
      // auto mode
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      body.classList.add(prefersDark ? 'dark' : 'light');
      darkActive = prefersDark;
    }

    this.isDarkTheme$.next(darkActive);
  }
}







 
