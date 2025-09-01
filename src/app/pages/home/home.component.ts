import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WeatherService } from '../../services/weather.service';
import { PreferencesService } from '../../services/preferences.service';
import { WeatherData, City } from '../../models/weather.model';

// Import child components
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { TemperatureToggleComponent } from './components/temperature-toggle/temperature-toggle.component';
import { NotificationsToggleComponent } from './components/notifications-toggle/notifications-toggle.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { WeatherDisplayComponent } from './components/weather-display/weather-display.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    SearchBarComponent,
    ThemeToggleComponent,
    TemperatureToggleComponent,
    NotificationsToggleComponent,
    FavoritesComponent,
    WeatherDisplayComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  currentWeather: WeatherData | null = null;
  currentTheme: string = 'light';
  isLoading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private weatherService: WeatherService,
    private preferencesService: PreferencesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to theme changes
    this.preferencesService.theme$
      .pipe(takeUntil(this.destroy$))
      .subscribe(theme => {
        this.currentTheme = theme;
      });

    // Subscribe to current weather updates
    this.weatherService.currentWeather$
      .pipe(takeUntil(this.destroy$))
      .subscribe(weather => {
        this.currentWeather = weather;
      });

    // Load default city weather
    this.loadDefaultWeather();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCitySelected(city: City): void {
    this.loadWeatherForCity(city.id);
  }

  onFavoriteCitySelected(city: City): void {
    this.loadWeatherForCity(city.id);
  }

  goToProfile(): void {
    this.router.navigate(['/user-profile']);  // ✅ navigates to profile page
  }

  private loadWeatherForCity(cityId: number): void {
    this.isLoading = true;
    this.error = null;

    this.weatherService.getCurrentWeather(cityId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (weather) => {
          this.currentWeather = weather;
          this.weatherService.setCurrentWeather(weather);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading weather:', error);
          this.error = 'Failed to load weather data. Please try again.';
          this.isLoading = false;
        }
      });
  }

  private loadDefaultWeather(): void {
    const defaultCityId = 1; // Replace with your default city ID
    this.loadWeatherForCity(defaultCityId);
  }
}
