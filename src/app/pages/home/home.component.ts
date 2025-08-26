import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherSearchComponent } from './components/weather-search/weather-search.component';
// import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { CurrentTimeComponent } from './components/current-time/current-time.component';
import { WeatherComponent } from '../../components/weather/weather.component';
import { ThemeService } from '../../services/theme.service';
import { WeatherService } from '../../services/weather.service';
import { UserService } from '../../core/user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    WeatherSearchComponent,
   
    FavoritesComponent,
    CurrentTimeComponent,
    WeatherComponent,
    MatChipsModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  isDarkTheme = false;
  currentWeatherData: any = null;
  isWeatherLoading = false;
  isInitialLoading = true;

  constructor(
    private themeService: ThemeService,
    private weatherService: WeatherService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initializeTheme();
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeTheme(): void {
    this.themeService.isDarkTheme$.pipe(takeUntil(this.destroy$)).subscribe((isDark: boolean) => {
      this.isDarkTheme = isDark;
    });

    // Load persisted theme from localStorage
    this.themeService.loadTheme();
  }

private async loadInitialData(): Promise<void> {
    try {
      // Load user's last viewed location or default location
      const userPreferences = await this.userService.getUserPreferences();
      const defaultLocation = userPreferences.lastLocation || 'New York';

      await this.loadWeatherData(defaultLocation);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      this.isInitialLoading = false;
    }
  }
 
  async onWeatherSelected(location: string): Promise<void> {
    await this.loadWeatherData(location);
  }

  async onFavoriteSelected(location: string): Promise<void> {
    await this.loadWeatherData(location);
  }

  private async loadWeatherData(location: string): Promise<void> {
    this.isWeatherLoading = true;

    try {
      this.currentWeatherData = await this.weatherService.getCurrentWeather(location);
      // Save as last viewed location
      await this.userService.updateLastLocation(location);
    } catch (error) {
      console.error('Failed to load weather data:', error);
      // Optional: Show error notification to user
    } finally {
      this.isWeatherLoading = false;
    }
  }
}
