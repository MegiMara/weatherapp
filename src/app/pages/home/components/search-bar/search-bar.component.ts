import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { WeatherService } from '../../../../services/weather.service';
import { City } from '../../../../models/weather.model';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  suggestions: City[] = [];
  showSuggestions = false;
  private destroy$ = new Subject<void>();

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(query => {
          if (query && query.length >= 2) {
            return this.weatherService.searchCities(query);
          }
          return [];
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(cities => {
        this.suggestions = cities.slice(0, 5); // Limit to 5 suggestions
        this.showSuggestions = this.suggestions.length > 0;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFocus(): void {
    if (this.suggestions.length > 0) {
      this.showSuggestions = true;
    }
  }

  onBlur(): void {
    // Delay hiding to allow click events on suggestions
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  selectCity(city: City): void {
    this.searchControl.setValue(city.name);
    this.showSuggestions = false;
    
    // Load weather for selected city
    this.weatherService.getCurrentWeather(city.id).subscribe(weather => {
      this.weatherService.setCurrentWeather(weather);
    });
  }
}