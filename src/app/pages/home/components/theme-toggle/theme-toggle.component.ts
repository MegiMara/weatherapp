import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreferencesService } from '../../../../services/preferences.service';

@Component({
  selector:'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss']
})
export class ThemeToggleComponent implements OnInit {
  currentTheme: 'light' | 'dark' = 'light';

  constructor(private preferencesService: PreferencesService) {}

  ngOnInit(): void {
    this.preferencesService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  toggleTheme(): void {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.preferencesService.setTheme(newTheme);
  }
}
