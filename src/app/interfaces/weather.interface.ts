// src/app/interfaces/weather.interface.ts

export interface WeatherData {
  location: string;
  temperature: number;
  description: string;   // <-- instead of "condition"
  humidity: number;
  windSpeed: number;
  pressure: number;
  feelsLike: number;
  visibility: number;
  icon: string;
  date: Date;
  country: string; 
  condition: string;
}

export interface ForecastData {
  date: string;
  temperature: number;
  maxTemp: number;
  minTemp: number;
  description: string;
  icon: string;
  humidity: number;
}

export interface FavoriteCity {
  id: string;
  name: string;
  country: string;  // <-- keep this for favorites, not for WeatherData
}
