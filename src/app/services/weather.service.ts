import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { WeatherData, City } from '../models/weather.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiUrl = 'https://localhost:7121/api/Weather'; // Replace with your backend URL
  private currentWeatherSubject = new BehaviorSubject<WeatherData | null>(null);
  public currentWeather$ = this.currentWeatherSubject.asObservable();

  constructor(private http: HttpClient) {}

  getCurrentWeather(cityId: number): Observable<WeatherData> {
    return this.http.get<WeatherData>(`${this.apiUrl}/weather/${cityId}`);
  }

 searchCities(query: string): Observable<City[]> {
  const params = new HttpParams().set('q', query);
  return this.http.get<City[]>(`${this.apiUrl}/search`, { params }); // ✅ ndryshuar URL
}

  getForecast(cityId: number, days: number = 7): Observable<WeatherData[]> {
    const params = new HttpParams().set('days', days.toString());
    return this.http.get<WeatherData[]>(`${this.apiUrl}/weather/${cityId}/forecast`, { params });
  }

  setCurrentWeather(weather: WeatherData): void {
    this.currentWeatherSubject.next(weather);
  }
}