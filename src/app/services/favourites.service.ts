// src/app/services/favourites.service.ts
import { Injectable, signal } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class FavoritesService {
private _list = signal<string[]>(JSON.parse(localStorage.getItem('favorites') || '[]'));


list = this._list.asReadonly();


add(city: string) {
const s = new Set(this._list()); s.add(city);
const arr = Array.from(s);
this._list.set(arr);
localStorage.setItem('favorites', JSON.stringify(arr));
}
remove(city: string) {
const arr = this._list().filter(c => c.toLowerCase() !== city.toLowerCase());
this._list.set(arr);
localStorage.setItem('favorites', JSON.stringify(arr));
}
}