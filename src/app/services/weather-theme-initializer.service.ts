import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { PreferencesService } from './preferences.service';

@Injectable({
  providedIn: 'root'
})
export class WeatherThemeInitializerService {
  private weatherRoutes = ['/home', '/favorites', '/user-profile'];

  constructor(
    private router: Router,
    private preferencesService: PreferencesService
  ) {
    this.initializeThemeRouting();
  }

  private initializeThemeRouting(): void {
    // Listen to route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.handleRouteChange(event.url);
      });

    // Initialize on first load
    this.handleRouteChange(this.router.url);
  }

  private handleRouteChange(url: string): void {
    const isWeatherRoute = this.weatherRoutes.some(route => url.startsWith(route));
    
    if (isWeatherRoute) {
      this.initializeWeatherAppTheme();
    } else {
      this.cleanupWeatherAppTheme();
    }
  }

  private initializeWeatherAppTheme(): void {
    // Add weather-app class to body when on weather routes
    if (typeof document !== 'undefined') {
      document.body.classList.add('weather-app');
      
      // Apply current theme
      const currentTheme = this.preferencesService.getTheme();
      document.body.setAttribute('data-theme', currentTheme);
    }
  }

  private cleanupWeatherAppTheme(): void {
    // Remove weather-app class when leaving weather routes
    if (typeof document !== 'undefined') {
      document.body.classList.remove('weather-app');
      document.body.removeAttribute('data-theme');
    }
  }

  // Method to manually initialize theme (call this in weather components)
  initializeForWeatherComponent(): void {
    this.initializeWeatherAppTheme();
  }

  // Method to check if current route is a weather route
  isWeatherRoute(): boolean {
    const currentUrl = this.router.url;
    return this.weatherRoutes.some(route => currentUrl.startsWith(route));
  }
}