import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentThemeSubject = new BehaviorSubject<Theme>(this.getStoredTheme());
  public currentTheme$ = this.currentThemeSubject.asObservable();

  constructor() {
    this.initializeTheme();
  }

  /**
   * Set the current theme
   */
  setTheme(theme: Theme): void {
    this.currentThemeSubject.next(theme);
    this.applyTheme(theme);
    this.storeTheme(theme);
  }

  /**
   * Get the current theme
   */
  getCurrentTheme(): Theme {
    return this.currentThemeSubject.value;
  }

  /**
   * Toggle between light and dark theme
   */
  toggleTheme(): void {
    const currentTheme = this.getCurrentTheme();
    const newTheme: Theme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  /**
   * Check if current theme is dark
   */
  isDarkTheme(): boolean {
    return this.getCurrentTheme() === 'dark';
  }

  /**
   * Auto-detect user's preferred theme based on system settings
   */
  detectSystemTheme(): Theme {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }

  /**
   * Set theme to match system preference
   */
  useSystemTheme(): void {
    const systemTheme = this.detectSystemTheme();
    this.setTheme(systemTheme);
  }

  /**
   * Initialize theme on service creation
   */
  private initializeTheme(): void {
    const storedTheme = this.getStoredTheme();
    this.applyTheme(storedTheme);
    
    // Listen for system theme changes
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a preference
        const hasManualPreference = localStorage.getItem('weather-app-theme');
        if (!hasManualPreference) {
          const systemTheme = e.matches ? 'dark' : 'light';
          this.setTheme(systemTheme);
        }
      });
    }
  }

  /**
   * Apply theme to the DOM
   */
  private applyTheme(theme: Theme): void {
    if (typeof document !== 'undefined') {
      // Remove existing theme classes
      document.documentElement.removeAttribute('data-theme');
      document.body.classList.remove('light-theme', 'dark-theme');
      
      // Apply new theme
      document.documentElement.setAttribute('data-theme', theme);
      document.body.classList.add(`${theme}-theme`);
      
      // Update meta theme-color for mobile browsers
      this.updateMetaThemeColor(theme);
    }
  }

  /**
   * Update meta theme-color for mobile browsers
   */
  private updateMetaThemeColor(theme: Theme): void {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    
    // Set theme color based on your CSS variables
    const themeColors = {
      light: '#FFFFFF', // --weather-bg-primary for light theme
      dark: '#0F172A'   // --weather-bg-primary for dark theme
    };
    
    metaThemeColor.setAttribute('content', themeColors[theme]);
  }

  /**
   * Get stored theme from localStorage
   */
  private getStoredTheme(): Theme {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('weather-app-theme') as Theme;
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    }
    
    // Default to system theme or light
    return this.detectSystemTheme();
  }

  /**
   * Store theme in localStorage
   */
  private storeTheme(theme: Theme): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('weather-app-theme', theme);
    }
  }

  /**
   * Get CSS variable value for current theme
   */
  getCSSVariable(variableName: string): string {
    if (typeof document !== 'undefined') {
      return getComputedStyle(document.documentElement)
        .getPropertyValue(variableName)
        .trim();
    }
    return '';
  }

  /**
   * Get theme colors object
   */
  getThemeColors(): Record<string, string> {
    return {
      primary: this.getCSSVariable('--weather-primary-color'),
      primaryLight: this.getCSSVariable('--weather-primary-color-light'),
      bgPrimary: this.getCSSVariable('--weather-bg-primary'),
      bgSecondary: this.getCSSVariable('--weather-bg-secondary'),
      bgTertiary: this.getCSSVariable('--weather-bg-tertiary'),
      bgHover: this.getCSSVariable('--weather-bg-hover'),
      textPrimary: this.getCSSVariable('--weather-text-primary'),
      textSecondary: this.getCSSVariable('--weather-text-secondary'),
      borderColor: this.getCSSVariable('--weather-border-color'),
      errorColor: this.getCSSVariable('--weather-error-color')
    };
  }

  /**
   * Reset theme to system default
   */
  resetTheme(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('weather-app-theme');
    }
    this.useSystemTheme();
  }
}