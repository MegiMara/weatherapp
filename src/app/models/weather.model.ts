export interface WeatherData {
  id: number;
  city: string;
  country: string;
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  pressure: number;
  visibility: number;
  uvIndex: number;
  icon: string;
  timestamp: Date;
}

export interface City {
  id: number;
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar: string;
  favoritesCities: number[];
}