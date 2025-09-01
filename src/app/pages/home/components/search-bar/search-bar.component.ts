import { Component, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { WeatherService } from '../../../../services/weather.service';
import { City } from '../../../../models/weather.model';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnDestroy {
  @Output() citySelected = new EventEmitter<City>();
  
  searchQuery = '';
  searchResults: City[] = [];
  isSearching = false;
  showResults = false;
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private weatherService: WeatherService) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (query.length < 2) {
          return [];
        }
        this.isSearching = true;
        return this.weatherService.searchCities(query);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.isSearching = false;
        this.showResults = results.length > 0;
      },
      error: (error) => {
        console.error('Search error:', error);
        this.isSearching = false;
        this.showResults = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value;
    this.searchSubject.next(this.searchQuery);
  }

  onCitySelect(city: City): void {
    this.searchQuery = city.name;
    this.showResults = false;
    this.citySelected.emit(city);
  }

  onFocus(): void {
    if (this.searchResults.length > 0) {
      this.showResults = true;
    }
  }

  onBlur(): void {
    // Delay hiding results to allow for clicks
    setTimeout(() => {
      this.showResults = false;
    }, 200);
  }

  // 🔍 New method for magnifying glass button
  triggerSearch(): void {
    if (this.searchQuery.trim()) {
      this.searchSubject.next(this.searchQuery);
    }
  }
}
