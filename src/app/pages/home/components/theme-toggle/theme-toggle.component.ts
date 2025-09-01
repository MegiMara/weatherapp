import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PreferencesService } from '../../../../services/preferences.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss']
})
export class ThemeToggleComponent implements OnInit, OnDestroy {
  currentTheme: 'light' | 'dark' = 'light';
  isToggling = false;
  private destroy$ = new Subject<void>();

  constructor(private preferencesService: PreferencesService) {}

  ngOnInit(): void {
    this.preferencesService.theme$
      .pipe(takeUntil(this.destroy$))
      .subscribe(theme => {
        this.currentTheme = theme;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleTheme(): void {
    if (this.isToggling) return;
    
    this.isToggling = true;
    
    // Add a small delay for smooth animation
    setTimeout(() => {
      this.preferencesService.toggleTheme();
      this.isToggling = false;
    }, 150);
  }

  getThemeIcon(): string {
    return this.currentTheme === 'light' ? '🌙' : '☀️';
  }

  getThemeLabel(): string {
    return this.currentTheme === 'light' ? 'dark' : 'light';
  }
}