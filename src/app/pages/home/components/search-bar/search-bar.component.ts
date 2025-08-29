import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Subject, of } from 'rxjs';
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
          return of([]);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(cities => {
        this.suggestions = cities.slice(0, 5);
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
    setTimeout(() => {
      this.showSuggestions = false;
    }, 250);
  }

  selectCity(city: City): void {
    this.searchControl.setValue(city.name, { emitEvent: false }); // mos e trigger valueChanges përsëri
    this.showSuggestions = false;

    this.weatherService.getCurrentWeather(city.id).subscribe(weather => {
      this.weatherService.setCurrentWeather(weather);
    });
  }

//   searchCity(): void {
//     const query = this.searchControl.value;
//     if (query && query.length >= 2) {
//       this.weatherService.searchCities(query).subscribe(cities => {
//         this.suggestions = cities.slice(0, 5);
//         this.showSuggestions = this.suggestions.length > 0;

//         // Zgjidh qytetin e parë automatikisht
//         if (cities.length > 0) {
//           this.selectCity(cities[0]);
//         }
//       });
//     }
//   }
// }

 searchCity(): void {
    const query = this.searchControl.value;
    console.log('Searching for:', query);  // kontrollon input-in

    if (query && query.length >= 2) {
      this.weatherService.searchCities(query).subscribe(cities => {
        console.log('Cities from backend:', cities);  // kontrollon përgjigjen nga backend
        this.suggestions = cities.slice(0, 5);
        this.showSuggestions = this.suggestions.length > 0;

        if (cities.length > 0) {
          this.selectCity(cities[0]);
        }
      });
    }
  }}
