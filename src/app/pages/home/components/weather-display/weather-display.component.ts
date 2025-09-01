import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WeatherData } from '../../../../models/weather.model';
import { PreferencesService } from '../../../../services/preferences.service';
import { UserService } from '../../../../core/user.service';

@Component({
  selector: 'app-weather-display',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './weather-display.component.html',
  styleUrls: ['./weather-display.component.scss']
})
export class WeatherDisplayComponent implements OnInit, OnDestroy {
  @Input() weatherData: WeatherData | null = null;
  temperatureUnit: 'celsius' | 'fahrenheit' = 'celsius';
  isFavorite = false;
  private destroy$ = new Subject<void>();

  constructor(
    private preferencesService: PreferencesService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.preferencesService.temperatureUnit$
      .pipe(takeUntil(this.destroy$))
      .subscribe(unit => {
        this.temperatureUnit = unit;
      });

    this.userService.userProfile$
      .pipe(takeUntil(this.destroy$))
      .subscribe(profile => {
        if (profile && this.weatherData) {
          this.isFavorite = profile.favoritesCities.includes(this.weatherData.id);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getTemperatureDisplay(temperature: number): string {
    const convertedTemp = this.preferencesService.convertTemperature(temperature, this.temperatureUnit);
    return `${convertedTemp}°${this.temperatureUnit === 'celsius' ? 'C' : 'F'}`;
  }

  toggleFavorite(): void {
    if (this.weatherData) {
      this.userService.updateFavorites(this.weatherData.id, !this.isFavorite)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedProfile) => {
            this.userService.setUserProfile(updatedProfile);
          },
          error: (error) => {
            console.error('Error updating favorites:', error);
          }
        });
    }
  }

  getWeatherBackgroundClass(): string {
    if (!this.weatherData) return 'default';
    
    const condition = this.weatherData.condition.toLowerCase();
    
    if (condition.includes('sun') || condition.includes('clear')) return 'sunny';
    if (condition.includes('cloud')) return 'cloudy';
    if (condition.includes('rain') || condition.includes('drizzle')) return 'rainy';
    if (condition.includes('snow')) return 'snowy';
    if (condition.includes('storm') || condition.includes('thunder')) return 'stormy';
    if (condition.includes('mist') || condition.includes('fog')) return 'misty';
    
    return 'default';
  }

  getWeatherEmoji(condition: string): string {
    const conditionLower = condition.toLowerCase();
    
    if (conditionLower.includes('sun') || conditionLower.includes('clear')) return '☀️';
    if (conditionLower.includes('cloud')) return '☁️';
    if (conditionLower.includes('rain')) return '🌧️';
    if (conditionLower.includes('drizzle')) return '🌦️';
    if (conditionLower.includes('snow')) return '❄️';
    if (conditionLower.includes('storm') || conditionLower.includes('thunder')) return '⛈️';
    if (conditionLower.includes('mist') || conditionLower.includes('fog')) return '🌫️';
    
    return '🌤️';
  }

  getWindDirection(degrees: string): string {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(parseInt(degrees) / 45) % 8;
    return directions[index];
  }
}
