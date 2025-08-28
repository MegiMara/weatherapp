// // src/app/pages/home/components/favorites/favorites.component.ts
// import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FavouritesService } from '../../../../services/favourites.service';

// interface FavoriteCity {
//   id: string;
//   name: string;
//   country: string;
//   addedAt: Date;
// }

// @Component({
//   selector: 'app-favorites',
//   standalone: true,
//   imports: [CommonModule],
//   template: `favorites.component.html`,
//   styles: [`favorites.component.scss`]
// })
// export class FavoritesComponent implements OnInit {
//   @Output() close = new EventEmitter<void>();
//   @Output() citySelected = new EventEmitter<{name: string; country: string}>();
  
//   private favouritesService = inject(FavouritesService);
  
//   favorites: FavoriteCity[] = [];
//   isLoading = true;

//   ngOnInit() {
//     this.loadFavorites();
//   }

//   private loadFavorites() {
//     this.isLoading = true;
//     this.favouritesService.getFavorites().subscribe({
//       next: (favorites) => {
//         this.favorites = favorites;
//         this.isLoading = false;
//       },
//       error: (error) => {
//         console.error('Failed to load favorites:', error);
//         this.isLoading = false;
//       }
//     });
//   }

//   selectCity(city: FavoriteCity) {
//     this.citySelected.emit({
//       name: city.name,
//       country: city.country
//     });
//   }

//   removeFavorite(city: FavoriteCity, event: Event) {
//     event.stopPropagation();
//     this.favouritesService.removeFavorite(city.id).subscribe({
//       next: () => {
//         this.favorites = this.favorites.filter(f => f.id !== city.id);
//       },
//       error: (error) => {
//         console.error('Failed to remove favorite:', error);
//       }
//     });
//   }

//   trackByFavorite(index: number, city: FavoriteCity): string {
//     return city.id;
//   }
// }