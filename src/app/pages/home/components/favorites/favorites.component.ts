import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../core/user.service';
import { WeatherService } from '../../../../services/weather.service';

interface FavoriteCity {
  id: number;
  name: string;
  country: string;
  temperature?: number;
  condition?: string;
  icon?: string;
  isLoading?: boolean;
  error?: boolean;
}

interface WeatherData {
  temperature: number;
  condition: string;
  country: string;
}

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, FormsModule],
templateUrl:'./favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent implements OnInit {
  @Output() favoriteSelected = new EventEmitter<string>();

  favoriteCities: FavoriteCity[] = [];
  isManageMode = false;
  showAddFavorite = false;
  newCityName = '';
  isAddingFavorite = false;
  temperatureUnit: 'celsius' | 'fahrenheit' = 'celsius';

  constructor(private userService: UserService, private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.loadFavoriteCities();
    this.loadTemperatureUnit();
  }

  /** ======= New methods ======= */
  private async loadFavoriteCities(): Promise<void> {
    try {
      this.favoriteCities = await this.userService.getFavoriteCities();
      await this.loadWeatherForFavorites();
    } catch (error) {
      console.error('Failed to load favorite cities:', error);
    }
  }

  private loadTemperatureUnit(): void {
    this.userService.getTemperatureUnit().subscribe((unit: 'celsius' | 'fahrenheit') => {
      this.temperatureUnit = unit;
    });
  }

  private getWeatherIcon(condition: string): string {
    const iconMap: { [key: string]: string } = {
      clear: '☀️',
      sunny: '☀️',
      'partly cloudy': '⛅',
      cloudy: '☁️',
      overcast: '☁️',
      rain: '🌧️',
      drizzle: '🌦️',
      snow: '❄️',
      storm: '⛈️',
      fog: '🌫️',
      mist: '🌫️',
    };
    return iconMap[condition.toLowerCase()] || '🌤️';
  }

  /** ======= Existing methods ======= */
  private async loadWeatherForFavorites(): Promise<void> {
    for (const city of this.favoriteCities) {
      city.isLoading = true;
      try {
        const weather: WeatherData = await this.weatherService.getCurrentWeather(city.name);
        city.temperature = weather.temperature;
        city.condition = weather.condition!;
        city.icon = this.getWeatherIcon(weather.condition!);
        city.error = false;
      } catch (error) {
        city.error = true;
        console.error(`Failed to load weather for ${city.name}:`, error);
      } finally {
        city.isLoading = false;
      }
    }
  }

  async addFavorite(): Promise<void> {
    if (!this.newCityName.trim() || this.isAddingFavorite) return;
    this.isAddingFavorite = true;

    try {
      const cityExists = this.favoriteCities.some(
        (city) => city.name.toLowerCase() === this.newCityName.trim().toLowerCase()
      );
      if (cityExists) {
        alert('This city is already in your favorites!');
        return;
      }

      const weather: WeatherData = await this.weatherService.getCurrentWeather(this.newCityName.trim());

      await this.userService.addFavoriteCity({
        name: this.newCityName.trim(),
        country: weather.country!,
      });

      const newFavorite: FavoriteCity = {
        id: Date.now(),
        name: this.newCityName.trim(),
        country: weather.country!,
        temperature: weather.temperature,
        condition: weather.condition!,
        icon: this.getWeatherIcon(weather.condition!),
      };

      this.favoriteCities.push(newFavorite);
      this.newCityName = '';
      this.showAddFavorite = false;
    } catch (error) {
      console.error('Failed to add favorite:', error);
      alert('Failed to add city. Please check the city name and try again.');
    } finally {
      this.isAddingFavorite = false;
    }
  }

  trackByCity(index: number, city: FavoriteCity): number {
    return city.id;
  }

  toggleManageMode(): void {
    this.isManageMode = !this.isManageMode;
    if (this.isManageMode) this.showAddFavorite = false;
  }

  onCityClick(city: FavoriteCity): void {
    if (!this.isManageMode) this.favoriteSelected.emit(city.name);
  }

  async removeFavorite(city: FavoriteCity, event: Event): Promise<void> {
    event.stopPropagation();
    try {
      await this.userService.removeFavoriteCity(city.id);
      this.favoriteCities = this.favoriteCities.filter((c) => c.id !== city.id);
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  }

  async refreshAllFavorites(): Promise<void> {
    await this.loadWeatherForFavorites();
  }
}

