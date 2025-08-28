 

// import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
// import { SettingsService } from '../../core/settings.service';
// import { UserService } from '../../core/user.service';


// // Angular Material
// import { MatCardModule } from '@angular/material/card';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// interface WeatherData {
//   location: string;
//   country: string;
//   temperature: number;
//   condition: string;
//   description: string; // ✅ added
//   feelsLike: number; // ✅ added
//   humidity: number;
//   windSpeed: number;
//   pressure: number;
//   visibility: number;
//   uvIndex: number; // ✅ added
//   sunrise: string; // ✅ added
//   sunset: string; // ✅ added
//   icon: string;
//   forecast?: {
//     date: string;
//     high: number;
//     low: number;
//     condition: string;
//     icon: string;
//   }[];
// }

// @Component({
//   selector: 'app-weather',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     MatCardModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatButtonModule,
//     MatProgressSpinnerModule,
  
//   ],
//   templateUrl: './weather.component.html',
//   styleUrls: ['./weather.component.scss'],
// })
// export class WeatherComponent implements OnChanges {
//   @Input() weatherData: WeatherData | null = null;
//   @Input() isLoading = false;

//   cityControl = new FormControl('', Validators.required);
//   temperatureUnit: 'celsius' | 'fahrenheit' = 'celsius';
//   isFavorited = false;
//   hasError = false;

//   suggestedCities = ['London', 'New York', 'Tokyo', 'Paris', 'Sydney', 'Dubai'];

//   constructor(private userService: UserService, private settingsService: SettingsService) {
//     this.loadTemperatureUnit();
//   }

//   ngOnChanges(changes: SimpleChanges): void {
//     if (changes['weatherData'] && this.weatherData) {
//       this.checkIfFavorited();
//       this.hasError = false;
//     }
//   }

//   private loadTemperatureUnit(): void {
//     this.userService.getTemperatureUnit().subscribe((unit) => {
//       this.temperatureUnit = unit;
//     });
//   }

//   private async checkIfFavorited(): Promise<void> {
//     if (!this.weatherData) return;
//     const favorites = await this.userService.getFavoriteCities();
//     this.isFavorited = favorites.some(
//       (fav) => fav.name.toLowerCase() === this.weatherData!.location.toLowerCase()
//     );
//   }

//   formatTemperature(temp: number): string {
//     if (this.temperatureUnit === 'fahrenheit') {
//       const fahrenheit = (temp * 9) / 5 + 32;
//       return `${Math.round(fahrenheit)}°`;
//     }
//     return `${Math.round(temp)}°`;
//   }

//   getWeatherIcon(condition: string): string {
//     const iconMap: { [key: string]: string } = {
//       clear: '☀️',
//       sunny: '☀️',
//       'partly cloudy': '⛅',
//       cloudy: '☁️',
//       overcast: '☁️',
//       rain: '🌧️',
//       snow: '❄️',
//       thunderstorm: '⛈️',
//       fog: '🌫️',
//     };
//     const key = condition.toLowerCase();
//     return iconMap[key] || '🌤️';
//   }

//   formatForecastDate(dateString: string): string {
//     const date = new Date(dateString);
//     const today = new Date();
//     const tomorrow = new Date(today);
//     tomorrow.setDate(today.getDate() + 1);

//     if (date.toDateString() === today.toDateString()) return 'Today';
//     if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
//     return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
//   }

//   onEnterPress(): void {
//     const city = this.cityControl.value;
//     if (city) console.log('Search for city:', city);
//   }

//   async toggleFavorite(): Promise<void> {
//     if (!this.weatherData) return;
//     const favorites = await this.userService.getFavoriteCities();
//     const cityName = this.weatherData.location;

//     if (this.isFavorited) {
//       const fav = favorites.find((f) => f.name.toLowerCase() === cityName.toLowerCase());
//       if (fav) await this.userService.removeFavoriteCity(fav.id);
//       this.isFavorited = false;
//     } else {
//       await this.userService.addFavoriteCity({ name: cityName, country: this.weatherData.country });
//       this.isFavorited = true;
//     }
//   }

//   searchSuggestion(city: string): void {
//     console.log('Searching suggested city:', city);
//   }
// }

import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { Weather } from '../../interfaces/weather.interface';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {
  weather: Weather = { city: 'Tirana', temp: 28, condition: 'Sunny', iconUrl: 'assets/icons/sunny.png' };

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.weatherService.getWeather('Tirana').subscribe(data => {
      this.weather = data;
    });
  }
}

