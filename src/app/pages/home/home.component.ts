// import { Component, OnInit, OnDestroy, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { interval, Subscription } from 'rxjs';

// // Import your services
// import { WeatherService } from '../../services/weather.service';
// import { AuthService } from '../../core/auth.service';
// import { UserService } from '../../core/user.service';
// import { FavouritesService } from '../../services/favourites.service';
// import { ThemeService } from '../../services/theme.service';

// // Import child components
// import { CurrentTimeComponent } from './components/current-time/current-time.component';
// import { NavbarComponent } from './components/navbar/navbar.component';
// import { WeatherSearchComponent } from './components/weather-search/weather-search.component';
// import { UserProfileComponent } from './components/user-profile/user-profile.component';
// import { FavoritesComponent } from './components/favorites/favorites.component';
// import { NotificationComponent } from './components/notification/notification.component';

// interface WeatherData {
//   city: string;
//   country: string;
//   temperature: number;
//   condition: string;
//   description: string;
//   humidity: number;
//   windSpeed: number;
//   icon: string;
//   backgroundImage: string;
// }

// interface User {
//   id: string;
//   username: string;
//   email: string;
//   profilePicture?: string;
// }

// @Component({
//   selector: 'app-home',
//   standalone: true,
//   imports: [
//     CommonModule, 
//     FormsModule,
//     CurrentTimeComponent,
//     NavbarComponent,
//     WeatherSearchComponent,
//     UserProfileComponent,
//     FavoritesComponent,
//     NotificationComponent
//   ],
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.scss']
// })
// export class HomeComponent implements OnInit, OnDestroy {
//   private weatherService = inject(WeatherService);
//   private authService = inject(AuthService);
//   private userService = inject(UserService);
//   private favouritesService = inject(FavouritesService);
//   private themeService = inject(ThemeService);
//   private router = inject(Router);
  
//   // Component state
//   currentUser: User | null = null;
//   weatherData: WeatherData | null = null;
//   searchQuery: string = '';
//   isLoading: boolean = false;
//   showProfileDropdown: boolean = false;
//   showFavorites: boolean = false;
//   showEditProfile: boolean = false;
//   isDarkTheme: boolean = false;
//   temperatureUnit: 'celsius' | 'fahrenheit' = 'celsius';
//   errorMessage: string = '';
  
//   private subscriptions: Subscription = new Subscription();

//   ngOnInit() {
//     this.loadUserData();
//     this.loadThemeSettings();
//     this.loadDefaultWeather();
//   }

//   ngOnDestroy() {
//     this.subscriptions.unsubscribe();
//   }

//   private loadUserData() {
//     const userSub = this.userService.getCurrentUser().subscribe({
//       next: (user) => {
//         this.currentUser = user;
//       },
//       error: (error) => {
//         console.error('Failed to load user data:', error);
//         this.handleAuthError();
//       }
//     });
//     this.subscriptions.add(userSub);
//   }

//   private loadThemeSettings() {
//     this.isDarkTheme = this.themeService.isDarkTheme();
//     this.temperatureUnit = this.themeService.getTemperatureUnit();
//   }

//   private loadDefaultWeather() {
//     // Load weather for user's last searched city or default location
//     this.searchWeather('London'); // Default city
//   }

//   onSearch() {
//     if (this.searchQuery.trim()) {
//       this.searchWeather(this.searchQuery.trim());
//     }
//   }

//   searchWeather(city: string) {
//     this.isLoading = true;
//     this.errorMessage = '';
    
//     const weatherSub = this.weatherService.getWeatherByCity(city).subscribe({
//       next: (data) => {
//         this.weatherData = {
//           city: data.name,
//           country: data.sys.country,
//           temperature: Math.round(data.main.temp),
//           condition: data.weather[0].main,
//           description: data.weather[0].description,
//           humidity: data.main.humidity,
//           windSpeed: data.wind.speed,
//           icon: data.weather[0].icon,
//           backgroundImage: this.getBackgroundImage(data.weather[0].main)
//         };
//         this.isLoading = false;
//       },
//       error: (error) => {
//         this.errorMessage = 'City not found. Please try again.';
//         this.isLoading = false;
//         console.error('Weather API error:', error);
//       }
//     });
//     this.subscriptions.add(weatherSub);
//   }

//   private getBackgroundImage(condition: string): string {
//     const backgrounds = {
//       'Clear': 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
//       'Clouds': 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)',
//       'Rain': 'linear-gradient(135deg, #81ecec 0%, #00b894 100%)',
//       'Snow': 'linear-gradient(135deg, #ddd6fe 0%, #8b5cf6 100%)',
//       'Thunderstorm': 'linear-gradient(135deg, #636e72 0%, #2d3436 100%)',
//       'Drizzle': 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
//       'Mist': 'linear-gradient(135deg, #b2bec3 0%, #636e72 100%)',
//       'Fog': 'linear-gradient(135deg, #b2bec3 0%, #636e72 100%)'
//     };
//     return backgrounds[condition as keyof typeof backgrounds] || backgrounds['Clear'];
//   }

//   toggleProfileDropdown() {
//     this.showProfileDropdown = !this.showProfileDropdown;
//   }

//   toggleTheme() {
//     this.isDarkTheme = !this.isDarkTheme;
//     this.themeService.setTheme(this.isDarkTheme ? 'dark' : 'light');
//   }

//   toggleTemperatureUnit() {
//     this.temperatureUnit = this.temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius';
//     this.themeService.setTemperatureUnit(this.temperatureUnit);
    
//     // Convert current temperature if weather data exists
//     if (this.weatherData) {
//       this.weatherData.temperature = this.convertTemperature(this.weatherData.temperature);
//     }
//   }

//   private convertTemperature(temp: number): number {
//     if (this.temperatureUnit === 'fahrenheit') {
//       return Math.round((temp * 9/5) + 32);
//     } else {
//       return Math.round((temp - 32) * 5/9);
//     }
//   }

//   addToFavorites() {
//     if (this.weatherData) {
//       const favoriteCity = {
//         name: this.weatherData.city,
//         country: this.weatherData.country
//       };
      
//       this.favouritesService.addFavorite(favoriteCity).subscribe({
//         next: () => {
//           // Show success notification
//           this.showNotification('City added to favorites!', 'success');
//         },
//         error: (error) => {
//           this.showNotification('Failed to add to favorites', 'error');
//           console.error('Add to favorites error:', error);
//         }
//       });
//     }
//   }

//   showFavoritesPanel() {
//     this.showFavorites = true;
//     this.showProfileDropdown = false;
//   }

//   showEditProfilePanel() {
//     this.showEditProfile = true;
//     this.showProfileDropdown = false;
//   }

//   toggleNotifications() {
//     // Toggle notification settings through the notification service
//     this.showProfileDropdown = false;
//   }

//   onFavoriteSelected(city: { name: string; country: string }) {
//     this.searchWeather(city.name);
//     this.searchQuery = city.name;
//     this.showFavorites = false;
//   }

//   onProfileUpdated(updatedUser: User) {
//     this.currentUser = updatedUser;
//     this.showEditProfile = false;
//   }

//   logout() {
//     this.authService.logout().subscribe({
//       next: () => {
//         this.router.navigate(['/login']);
//       },
//       error: (error) => {
//         console.error('Logout error:', error);
//         // Force logout even if API call fails
//         this.router.navigate(['/login']);
//       }
//     });
//   }

//   private handleAuthError() {
//     this.router.navigate(['/login']);
//   }

//   private showNotification(message: string, type: 'success' | 'error') {
//     // Implementation for showing notifications
//     console.log(`${type}: ${message}`);
//   }

//   // Close dropdowns when clicking outside
//   onDocumentClick(event: Event) {
//     const target = event.target as HTMLElement;
//     if (!target.closest('.profile-dropdown-container')) {
//       this.showProfileDropdown = false;
//     }
//   }

//   getTemperatureDisplay(): string {
//     if (!this.weatherData) return '';
//     const unit = this.temperatureUnit === 'celsius' ? '°C' : '°F';
//     return `${this.weatherData.temperature}${unit}`;
//   }

//   getWindSpeedDisplay(): string {
//     if (!this.weatherData) return '';
//     const unit = this.temperatureUnit === 'celsius' ? 'km/h' : 'mph';
//     const speed = this.temperatureUnit === 'celsius' 
//       ? Math.round(this.weatherData.windSpeed * 3.6)
//       : Math.round(this.weatherData.windSpeed * 2.237);
//     return `${speed} ${unit}`;
//   }
// }