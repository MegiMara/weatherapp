import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, forkJoin, of } from 'rxjs';
import { takeUntil, switchMap, catchError } from 'rxjs/operators';
import { UserService } from '../../../../core/user.service';
import { WeatherService } from '../../../../services/weather.service';
import { PreferencesService } from '../../../../services/preferences.service';
import { UserProfile,WeatherData, City } from '../../../../models/weather.model';

interface FavoriteCity {
  id: number;
  name: string;
  country: string;
  temperature: number;
  condition: string;
  icon: string;
  lastUpdated?: Date;
}

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit, OnDestroy {
  @Output() citySelected = new EventEmitter<City>();
  
  favoriteCities: FavoriteCity[] = [];
  temperatureUnit: 'celsius' | 'fahrenheit' = 'celsius';
  isLoading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private weatherService: WeatherService,
    private preferencesService: PreferencesService
  ) {}

  ngOnInit(): void {
    // Subscribe to temperature unit changes
    this.preferencesService.temperatureUnit$
      .pipe(takeUntil(this.destroy$))
      .subscribe(unit => {
        this.temperatureUnit = unit;
      });

    // Subscribe to user profile changes to load favorite cities
    this.userService.userProfile$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((profile: UserProfile | null) => {
          if (profile && profile.favoritesCities && profile.favoritesCities.length > 0) {
            this.isLoading = true;
            this.error = null;
            return this.loadFavoriteCitiesWeather(profile.favoritesCities);
          } else {
            this.favoriteCities = [];
            this.isLoading = false;
            return of([]);
          }
        })
      )
      .subscribe({
        next: (cities) => {
          this.favoriteCities = cities;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading favorite cities:', error);
          this.error = 'Failed to load favorite cities';
          this.isLoading = false;
        }
      });

    // Auto-refresh favorite cities weather every 10 minutes
    setInterval(() => {
      if (this.favoriteCities.length > 0) {
        this.refreshFavoritesWeather();
      }
    }, 10 * 60 * 1000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectCity(city: FavoriteCity): void {
    this.isLoading = true;
    
    this.weatherService.getCurrentWeather(city.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (weather) => {
          this.weatherService.setCurrentWeather(weather);
          // Emit event to parent component with coordinates from weather data
          this.citySelected.emit({
            id: city.id,
            name: city.name,
            country: city.country,
            lat: weather.lat || 0, // Use weather coordinates or default
            lon: weather.lon || 0  // Use weather coordinates or default
          });
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading weather for city:', error);
          this.error = `Failed to load weather for ${city.name}`;
          this.isLoading = false;
        }
      });
  }

  removeFavorite(cityId: number, event: Event): void {
    event.stopPropagation();
    
    const cityToRemove = this.favoriteCities.find(city => city.id === cityId);
    
    if (confirm(`Remove ${cityToRemove?.name} from favorites?`)) {
      this.userService.updateFavorites(cityId, false)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedProfile) => {
            this.userService.setUserProfile(updatedProfile);
          },
          error: (error) => {
            console.error('Error removing favorite:', error);
            this.error = 'Failed to remove city from favorites';
          }
        });
    }
  }

  refreshFavoritesWeather(): void {
    if (this.favoriteCities.length === 0) return;
    
    const cityIds = this.favoriteCities.map(city => city.id);
    this.loadFavoriteCitiesWeather(cityIds).subscribe({
      next: (cities) => {
        this.favoriteCities = cities;
      },
      error: (error) => {
        console.error('Error refreshing weather:', error);
      }
    });
  }

  getWeatherEmoji(condition: string): string {
    if (!condition) return '🌤️';
    
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

  getTemperatureDisplay(temperature: number): string {
    if (typeof temperature !== 'number') return 'N/A';
    
    const convertedTemp = this.preferencesService.convertTemperature(temperature, this.temperatureUnit);
    return `${convertedTemp}°${this.temperatureUnit === 'celsius' ? 'C' : 'F'}`;
  }

  getLastUpdatedText(city: FavoriteCity): string {
    if (!city.lastUpdated) return '';
    
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - city.lastUpdated.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return city.lastUpdated.toLocaleDateString();
  }

  trackByCity(index: number, city: FavoriteCity): number {
    return city.id;
  }

  private loadFavoriteCitiesWeather(cityIds: number[]) {
    const weatherRequests = cityIds.map(cityId => 
      this.weatherService.getCurrentWeather(cityId).pipe(
        catchError(error => {
          console.error(`Error loading weather for city ${cityId}:`, error);
          return of(null);
        })
      )
    );

    return forkJoin(weatherRequests).pipe(
      takeUntil(this.destroy$),
      switchMap(weatherDataArray => {
        const validWeatherData = weatherDataArray.filter(weather => weather !== null) as WeatherData[];
        
        const favoriteCities: FavoriteCity[] = validWeatherData.map(weather => ({
          id: weather.id,
          name: weather.city,
          country: weather.country,
          temperature: weather.temperature,
          condition: weather.condition,
          icon: weather.icon || '',
          lastUpdated: new Date()
        }));
        
        return of(favoriteCities);
      }),
      catchError(error => {
        console.error('Error in loadFavoriteCitiesWeather:', error);
        return of([]);
      })
    );
  }
}