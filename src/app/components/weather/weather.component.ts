// src/app/components/weather/weather.component.ts
/*import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';

// Angular Material Imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';

import { WeatherService } from '../../services/weather.service';
import { WeatherData, ForecastData } from '../../interfaces/weather.interface';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatDividerModule,
    MatChipsModule,
    MatGridListModule
  ],
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {
  // Signals for reactive state management
  currentWeather = signal<WeatherData | null>(null);
  forecast = signal<ForecastData[]>([]);
  loading = signal(false);
  recentSearches = signal<string[]>([]);
  
  // Form control for city input
  cityControl = new FormControl('', [
    Validators.required, 
    Validators.minLength(2)
  ]);

  // Computed property for weather icon class
  weatherIconClass = computed(() => {
    const weather = this.currentWeather();
    if (!weather) return 'wb_sunny';
    
    const desc = weather.description.toLowerCase();
    if (desc.includes('rain')) return 'umbrella';
    if (desc.includes('cloud')) return 'cloud';
    if (desc.includes('sun') || desc.includes('clear')) return 'wb_sunny';
    if (desc.includes('snow')) return 'ac_unit';
    return 'wb_sunny';
  });

  constructor(
    private weatherService: WeatherService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadRecentSearches();
    // Load default city
    this.searchWeather('London');
  }

  searchWeather(city?: string): void {
    const searchCity = city || this.cityControl.value;
    
    if (!searchCity || searchCity.trim().length < 2) {
      this.showSnackBar('Please enter a valid city name');
      return;
    }

    this.loading.set(true);
    const trimmedCity = searchCity.trim();

    this.weatherService.getCurrentWeather(trimmedCity).subscribe({
      next: (weather: WeatherData) => {
        this.currentWeather.set(weather);
        this.addToRecentSearches(trimmedCity);
        this.loadForecast(trimmedCity);
      },
      error: (error: Error) => {
        this.loading.set(false);
        this.showSnackBar('City not found. Try: London, New York, Paris, Tokyo, or Sydney');
        console.error('Weather error:', error);
      }
    });
  }

  private loadForecast(city: string): void {
    this.weatherService.getForecast(city).subscribe({
      next: (forecastData: ForecastData[]) => {
        this.forecast.set(forecastData);
        this.loading.set(false);
      },
      error: (error: Error) => {
        this.loading.set(false);
        console.error('Forecast error:', error);
      }
    });
  }

  onEnterPress(): void {
    if (this.cityControl.valid) {
      this.searchWeather();
    }
  }

  searchFromChip(city: string): void {
    this.cityControl.setValue(city);
    this.searchWeather(city);
  }

  private addToRecentSearches(city: string): void {
    const current = this.recentSearches();
    if (!current.includes(city)) {
      const updated = [city, ...current].slice(0, 5);
      this.recentSearches.set(updated);
      this.saveRecentSearches();
    }
  }

  private loadRecentSearches(): void {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('recentWeatherSearches');
      if (saved) {
        this.recentSearches.set(JSON.parse(saved));
      }
    }
  }

  private saveRecentSearches(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('recentWeatherSearches', JSON.stringify(this.recentSearches()));
    }
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', { 
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  getIconForWeather(icon: string): string {
    const iconMap: { [key: string]: string } = {
      'sunny': 'wb_sunny',
      'cloudy': 'cloud',
      'partly-cloudy': 'partly_cloudy_day',
      'rainy': 'umbrella',
      'snow': 'ac_unit'
    };
    return iconMap[icon] || 'wb_sunny';
  }
} */

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { SettingsService } from '../../core/settings.service';
import { UserService } from '../../core/user.service';


// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface WeatherData {
  location: string;
  country: string;
  temperature: number;
  condition: string;
  description: string; // ✅ added
  feelsLike: number; // ✅ added
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  uvIndex: number; // ✅ added
  sunrise: string; // ✅ added
  sunset: string; // ✅ added
  icon: string;
  forecast?: {
    date: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
  }[];
}

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  
  ],
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
})
export class WeatherComponent implements OnChanges {
  @Input() weatherData: WeatherData | null = null;
  @Input() isLoading = false;

  cityControl = new FormControl('', Validators.required);
  temperatureUnit: 'celsius' | 'fahrenheit' = 'celsius';
  isFavorited = false;
  hasError = false;

  suggestedCities = ['London', 'New York', 'Tokyo', 'Paris', 'Sydney', 'Dubai'];

  constructor(private userService: UserService, private settingsService: SettingsService) {
    this.loadTemperatureUnit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['weatherData'] && this.weatherData) {
      this.checkIfFavorited();
      this.hasError = false;
    }
  }

  private loadTemperatureUnit(): void {
    this.userService.getTemperatureUnit().subscribe((unit) => {
      this.temperatureUnit = unit;
    });
  }

  private async checkIfFavorited(): Promise<void> {
    if (!this.weatherData) return;
    const favorites = await this.userService.getFavoriteCities();
    this.isFavorited = favorites.some(
      (fav) => fav.name.toLowerCase() === this.weatherData!.location.toLowerCase()
    );
  }

  formatTemperature(temp: number): string {
    if (this.temperatureUnit === 'fahrenheit') {
      const fahrenheit = (temp * 9) / 5 + 32;
      return `${Math.round(fahrenheit)}°`;
    }
    return `${Math.round(temp)}°`;
  }

  getWeatherIcon(condition: string): string {
    const iconMap: { [key: string]: string } = {
      clear: '☀️',
      sunny: '☀️',
      'partly cloudy': '⛅',
      cloudy: '☁️',
      overcast: '☁️',
      rain: '🌧️',
      snow: '❄️',
      thunderstorm: '⛈️',
      fog: '🌫️',
    };
    const key = condition.toLowerCase();
    return iconMap[key] || '🌤️';
  }

  formatForecastDate(dateString: string): string {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  onEnterPress(): void {
    const city = this.cityControl.value;
    if (city) console.log('Search for city:', city);
  }

  async toggleFavorite(): Promise<void> {
    if (!this.weatherData) return;
    const favorites = await this.userService.getFavoriteCities();
    const cityName = this.weatherData.location;

    if (this.isFavorited) {
      const fav = favorites.find((f) => f.name.toLowerCase() === cityName.toLowerCase());
      if (fav) await this.userService.removeFavoriteCity(fav.id);
      this.isFavorited = false;
    } else {
      await this.userService.addFavoriteCity({ name: cityName, country: this.weatherData.country });
      this.isFavorited = true;
    }
  }

  searchSuggestion(city: string): void {
    console.log('Searching suggested city:', city);
  }
}
