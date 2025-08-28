/*import { NgModule } from '@angular/core';*/
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
// import { HomeComponent } from './pages/home/home.component';
// import { FavoritesComponent } from './pages/home/components/favorites/favorites.component';
import { UserProfileComponent } from './pages/home/components/user-profile/user-profile.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  // { path: 'home', component: HomeComponent },
  //  { path: 'favorites', component: FavoritesComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
