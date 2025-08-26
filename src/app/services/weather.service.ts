import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiKey = 'YOUR_API_KEY'; // 🔑 put your OpenWeather API key here
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(private http: HttpClient) {}

  // ✅ Get current weather by location
  async getCurrentWeather(location: string): Promise<any> {
    const url = `${this.apiUrl}?q=${location}&appid=${this.apiKey}&units=metric`;
    return this.http.get(url).toPromise();
  }
}
