/*import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Services
import { UserService } from '../../../../core/user.service';
import { ThemeService } from '../../../../services/theme.service';
import { AuthService } from '../../../../core/auth.service';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  preferences: {
    temperatureUnit: 'celsius' | 'fahrenheit';
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    language: string;
  };
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  userProfile: UserProfile | null = null;
  isDropdownOpen = false;

  currentTheme: 'light' | 'dark' | 'auto' = 'auto';
  temperatureUnit: 'celsius' | 'fahrenheit' = 'celsius';
  notificationsEnabled = true;

  constructor(
    private userService: UserService,
    private themeService: ThemeService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    /*this.loadUserProfile();*/


  /** Load the logged-in user profile */
/*  private async loadUserProfile(): Promise<void> {
    try {
      this.userProfile = await this.userService.getCurrentUser();
    } catch (error) {
      console.error('❌ Failed to load user profile:', error);
    }
  }

  */

  /** Load user preferences like theme, temperature unit, notifications */
  /*private loadPreferences(): void {
    // Get theme synchronously from ThemeService
    this.currentTheme = this.themeService.getCurrentTheme();

    // Subscribe to dark mode changes (if ThemeService has BehaviorSubject)
    if (this.themeService.isDarkTheme$) {
      this.themeService.isDarkTheme$.pipe(takeUntil(this.destroy$)).subscribe((isDark) => {
        console.log('Dark mode active:', isDark);
      });
    }

    // Preferences from UserService
 
    this.userService
      .getTemperatureUnit()
      .pipe(takeUntil(this.destroy$))
      .subscribe((unit) => (this.temperatureUnit = unit));

    /*this.userService
     /* .getNotificationsEnabled()*/
     /* .pipe(takeUntil(this.destroy$))
      .subscribe((enabled) => (this.notificationsEnabled = enabled));
  }*/

  /** Utility to show initials if no avatar exists */
  /* getInitials(): string {
    if (!this.userProfile) return 'U';
    const { firstName, lastName } = this.userProfile;
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }

  /** Dropdown handling */
  /*toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  /** Update preferences */
/* onThemeChange(theme: 'light' | 'dark' | 'auto'): void {
    this.currentTheme = theme;
    this.themeService.setTheme(theme);
  }

  onTemperatureChange(unit: 'celsius' | 'fahrenheit'): void {
    this.temperatureUnit = unit;
    this.userService.setTemperatureUnit(unit);
  }

  onNotificationsChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.notificationsEnabled = target.checked;
    this.userService.setNotificationsEnabled(this.notificationsEnabled);
  }

  /** Profile actions */
/*  editProfile(): void {
    this.closeDropdown();
    console.log('✏️ Edit profile clicked');
  }

  openSettings(): void {
    this.closeDropdown();
    console.log('⚙️ Settings clicked');
  }

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('❌ Logout failed:', error);
    }
  }
}*/
