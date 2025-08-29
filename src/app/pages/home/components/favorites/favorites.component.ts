import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';
import { UserService } from '../../../../core/user.service';
import { WeatherService } from '../../../../services/weather.service';
import { PreferencesService } from '../../../../services/preferences.service';
import { UserProfile, WeatherData } from '../../../../models/weather.model';

interface FavoriteCity {
  id: number;
  name: string;
  country: string;
  temperature: number;
  condition: string;
  icon: string;
}

@Component({
  selector: 'app-favorites',
  templateUrl:'./favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit, OnDestroy {
  favoriteCities: FavoriteCity[] = [];
  temperatureUnit: 'celsius' | 'fahrenheit' = 'celsius';
  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private weatherService: WeatherService,
    private preferencesService: PreferencesService
  ) {}

  ngOnInit(): void {
    this.preferencesService.temperatureUnit$
      .pipe(takeUntil(this.destroy$))
      .subscribe(unit => {
        this.temperatureUnit = unit;
      });

    this.userService.userProfile$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((profile: UserProfile | null) => {
          if (profile && profile.favoritesCities.length > 0) {
            return this.loadFavoriteCitiesWeather(profile.favoritesCities);
          }
          return [];
        })
      )
      .subscribe(cities => {
        this.favoriteCities = cities;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectCity(city: FavoriteCity): void {
    this.weatherService.getCurrentWeather(city.id).subscribe(weather => {
      this.weatherService.setCurrentWeather(weather);
    });
  }

  removeFavorite(cityId: number, event: Event): void {
    event.stopPropagation();
    this.userService.updateFavorites(cityId, false).subscribe(updatedProfile => {
      this.userService.setUserProfile(updatedProfile);
    });
  }
// Add this to favorites.component.ts
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
  getTemperatureDisplay(temperature: number): string {
    const convertedTemp = this.preferencesService.convertTemperature(temperature, this.temperatureUnit);
    return `${convertedTemp}°${this.temperatureUnit === 'celsius' ? 'C' : 'F'}`;
  }

  private loadFavoriteCitiesWeather(cityIds: number[]): Promise<FavoriteCity[]> {
    const weatherPromises = cityIds.map(cityId => 
      this.weatherService.getCurrentWeather(cityId).toPromise()
    );

    return Promise.all(weatherPromises).then(weatherDataArray => {
      return weatherDataArray.map(weather => ({
        id: weather!.id,
        name: weather!.city,
        country: weather!.country,
        temperature: weather!.temperature,
        condition: weather!.condition,
        icon: weather!.icon
      }));
    });
  }
}
