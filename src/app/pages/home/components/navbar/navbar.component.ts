// import { Component, computed, inject } from '@angular/core';
// import { CommonModule, NgOptimizedImage } from '@angular/common';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatIconModule } from '@angular/material/icon';
// import { MatMenuModule } from '@angular/material/menu';
// import { MatButtonModule } from '@angular/material/button';
// import { MatSlideToggleModule } from '@angular/material/slide-toggle';
// import { MatListModule } from '@angular/material/list';
// import { SettingsService } from '../../../../core/settings.service';
// import { CurrentTimeComponent } from '../current-time/current-time.component';


// @Component({
// selector: 'app-topbar',
// standalone: true,
// imports: [CommonModule, NgOptimizedImage, MatToolbarModule, MatIconModule, MatMenuModule,MatButtonModule, MatSlideToggleModule, MatListModule, CurrentTimeComponent],
// templateUrl:'./navbar.component.html',
// styleUrls:['./navbar.component.scss'],

// })

// export class TopbarComponent {
// private settings = inject(SettingsService);
// username = this.settings.username;
// avatar = this.settings.avatarUrl;
// theme = this.settings.theme;
// unit = this.settings.unit;


// toggleTheme(){ this.settings.toggleTheme(); }
// toggleUnit(){ this.settings.toggleUnit(); }
// editProfile(){
// // For now, a simple prompt. Replace with a proper dialog later.
// const name = prompt('New username', this.username());
// const url = prompt('Avatar URL', this.avatar());
// if(name && url){ this.settings.updateProfile(name, url); }
// }
// }

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';

// Nëse ke këta komponentë custom standalone:
import { CurrentTimeComponent } from '../current-time/current-time.component';
import { WeatherSearchComponent } from '../weather-search/weather-search.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatDividerModule,
    // CurrentTimeComponent,
    WeatherSearchComponent
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  isFahrenheit = false;
  isDarkMode = false;

  constructor(private router: Router) {}

  goToProfile() {
    this.router.navigate(['/user-profile']);
  }

  goToFavorites() {
    this.router.navigate(['/favorites']);
  }

  toggleUnit() {
    console.log("Unit switched:", this.isFahrenheit ? "Fahrenheit" : "Celsius");
  }

  toggleTheme() {
    document.body.classList.toggle('dark-theme', this.isDarkMode);
  }

  logout() {
    console.log("User logged out");
  }
}
