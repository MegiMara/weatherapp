import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Import ALL standalone components
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { TemperatureToggleComponent } from './components/temperature-toggle/temperature-toggle.component';
import { NotificationsToggleComponent } from './components/notifications-toggle/notifications-toggle.component';
import { ProfilePictureComponent } from './components/profile-picture/profile-picture.component';
import { WeatherDisplayComponent } from './components/weather-display/weather-display.component';
import { FavoritesComponent } from './components/favorites/favorites.component';

// Import services
import { WeatherService } from '../../services/weather.service';
import { UserService } from '../../core/user.service';
import { PreferencesService } from '../../services/preferences.service';
import { WeatherData } from '../../models/weather.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    // Add ALL the standalone components here
    SearchBarComponent,
    ThemeToggleComponent,
    TemperatureToggleComponent,
    NotificationsToggleComponent,
    ProfilePictureComponent,
    WeatherDisplayComponent,
    FavoritesComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  currentWeather: WeatherData | null = null;
  currentTheme: 'light' | 'dark' = 'light';
  private destroy$ = new Subject<void>();

  constructor(
    private weatherService: WeatherService,
    private userService: UserService,
    private preferencesService: PreferencesService
  ) {}

  ngOnInit(): void {
    this.preferencesService.theme$
      .pipe(takeUntil(this.destroy$))
      .subscribe(theme => {
        this.currentTheme = theme;
      });

    this.weatherService.currentWeather$
      .pipe(takeUntil(this.destroy$))
      .subscribe(weather => {
        this.currentWeather = weather;
      });

    // Load default weather for user's location or first favorite city
    this.loadDefaultWeather();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDefaultWeather(): void {
    // Load weather for the first favorite city or default city
    const defaultCityId = 1; // Replace with actual logic
    this.weatherService.getCurrentWeather(defaultCityId).subscribe(weather => {
      this.weatherService.setCurrentWeather(weather);
    });
  }
}