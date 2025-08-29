import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreferencesService } from '../../../../services/preferences.service';

@Component({
  selector: 'app-temperature-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './temperature-toggle.component.html',
  styleUrls: ['./temperature-toggle.component.scss']
})
export class TemperatureToggleComponent implements OnInit {
  currentUnit: 'celsius' | 'fahrenheit' = 'celsius';

  constructor(private preferencesService: PreferencesService) {}

  ngOnInit(): void {
    this.preferencesService.temperatureUnit$.subscribe(unit => {
      this.currentUnit = unit;
    });
  }

  toggleUnit(): void {
    const newUnit = this.currentUnit === 'celsius' ? 'fahrenheit' : 'celsius';
    this.preferencesService.setTemperatureUnit(newUnit);
  }
}