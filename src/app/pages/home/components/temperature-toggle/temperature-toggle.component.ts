import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PreferencesService } from '../../../../services/preferences.service';

@Component({
  selector: 'app-temperature-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      class="temperature-toggle" 
      (click)="toggleUnit()" 
      [title]="'Temperature unit: ' + (temperatureUnit === 'celsius' ? 'Celsius' : 'Fahrenheit')"
      type="button"
    >
      <span class="temp-unit">{{ temperatureUnit === 'celsius' ? '°C' : '°F' }}</span>
    </button>
  `,
  styles: [`
    .temperature-toggle {
      background: transparent;
      border: 2px solid transparent;
      border-radius: 8px;
      padding: 0.5rem 0.75rem;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--weather-text-secondary, #64748b);
      font-weight: 600;

      &:hover {
        background: var(--weather-bg-hover, rgba(0, 0, 0, 0.05));
        border-color: var(--weather-border-color, rgba(0, 0, 0, 0.1));
        color: var(--weather-primary-color, #3b82f6);
        transform: scale(1.05);
      }

      &:active {
        transform: scale(0.95);
      }

      .temp-unit {
        font-size: 0.9rem;
        font-weight: 700;
      }
    }

    // Dark theme support
    [data-theme="dark"] .temperature-toggle {
      color: var(--weather-text-secondary, #cbd5e1);

      &:hover {
        background: var(--weather-bg-hover, rgba(255, 255, 255, 0.1));
        border-color: var(--weather-border-color, rgba(255, 255, 255, 0.2));
        color: var(--weather-primary-color, #60a5fa);
      }
    }
  `]
})
export class TemperatureToggleComponent implements OnInit, OnDestroy {
  temperatureUnit: 'celsius' | 'fahrenheit' = 'celsius';
  private destroy$ = new Subject<void>();

  constructor(private preferencesService: PreferencesService) {}

  ngOnInit(): void {
    this.preferencesService.temperatureUnit$
      .pipe(takeUntil(this.destroy$))
      .subscribe(unit => {
        this.temperatureUnit = unit;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleUnit(): void {
    const newUnit = this.temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius';
    this.preferencesService.setTemperatureUnit(newUnit);
  }
}