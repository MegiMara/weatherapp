import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { FavoritesComponent } from './pages/home/components/favorites/favorites.component';
import { ProfilePictureComponent } from './pages/home/components/profile-picture/profile-picture.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },           // 🌤️ This becomes your main weather page
  { path: 'favorites', component: FavoritesComponent }, // 🌤️ This becomes weather favorites
  { path: 'user-profile', component: ProfilePictureComponent }, // 🌤️ This becomes user profile
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
