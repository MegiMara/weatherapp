import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-weather-search',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatButtonModule],
  templateUrl: './weather-search.component.html',
  styleUrls: ['./weather-search.component.scss']
})
export class WeatherSearchComponent {
  query: string = ''; // ✅ shto këtë property
  @Output() weatherSelected = new EventEmitter<string>();

  onSearch() {
    if (this.query.trim()) {
      this.weatherSelected.emit(this.query.trim());
    }
  }
}
