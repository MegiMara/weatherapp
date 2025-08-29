// home.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { WeatherDisplayComponent } from './components/weather-display/weather-display.component';
import { WeatherSearchComponent } from '../../components/shared/weather-search/weather-search.component';
import { WeatherService } from '../../core/services/weather.service';
import { SettingsService } from '../../core/services/settings.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    WeatherDisplayComponent,
    WeatherSearchComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  currentWeather = signal<any>(null);
  isLoading = signal<boolean>(true);
  error = signal<string>('');

  constructor(
    private weatherService: WeatherService,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.loadDefaultWeather();
  }

  private async loadDefaultWeather(): Promise<void> {
    try {
      this.isLoading.set(true);
      // Try to get user location first
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const weather = await this.weatherService.getWeatherByCoordinates(
              position.coords.latitude,
              position.coords.longitude
            );
            this.currentWeather.set(weather);
            this.isLoading.set(false);
          },
          async () => {
            // If location is denied, load default city (Tirana)
            await this.loadWeatherForCity('Tirana');
          }
        );
      } else {
        await this.loadWeatherForCity('Tirana');
      }
    } catch (error) {
      this.error.set('Failed to load weather data');
      this.isLoading.set(false);
    }
  }

  async onCitySearch(cityName: string): Promise<void> {
    await this.loadWeatherForCity(cityName);
  }

  private async loadWeatherForCity(cityName: string): Promise<void> {
    try {
      this.isLoading.set(true);
      this.error.set('');
      const weather = await this.weatherService.getWeatherByCity(cityName);
      this.currentWeather.set(weather);
      this.isLoading.set(false);
    } catch (error) {
      this.error.set(`Could not find weather data for ${cityName}`);
      this.isLoading.set(false);
    }
  }

  get backgroundClass(): string {
    const weather = this.currentWeather();
    if (!weather) return 'default-bg';
    
    const condition = weather.condition?.toLowerCase() || '';
    const isDay = this.isDay();
    
    if (condition.includes('rain') || condition.includes('drizzle')) {
      return isDay ? 'rainy-day-bg' : 'rainy-night-bg';
    } else if (condition.includes('cloud')) {
      return isDay ? 'cloudy-day-bg' : 'cloudy-night-bg';
    } else if (condition.includes('clear') || condition.includes('sun')) {
      return isDay ? 'sunny-day-bg' : 'clear-night-bg';
    } else if (condition.includes('snow')) {
      return isDay ? 'snowy-day-bg' : 'snowy-night-bg';
    }
    
    return isDay ? 'default-day-bg' : 'default-night-bg';
  }

  private isDay(): boolean {
    const hour = new Date().getHours();
    return hour >= 6 && hour < 18;
  }
}