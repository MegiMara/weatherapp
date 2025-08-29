import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '../../../../core/user.service';
import { UserProfile } from '../../../../models/weather.model';

@Component({
  selector: 'app-profile-picture',
  standalone: true,
  imports: [CommonModule],
  templateUrl:'./profile-picture.component.html',
  styleUrls:['./profile-picture.component.scss']
  })
export class ProfilePictureComponent implements OnInit, OnDestroy {
  userProfile: UserProfile | null = null;
  showDropdown = false;
  private destroy$ = new Subject<void>();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.userProfile$
      .pipe(takeUntil(this.destroy$))
      .subscribe(profile => {
        this.userProfile = profile;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  logout(): void {
    this.userService.logout().subscribe(() => {
      // Handle logout redirect
      window.location.href = '/login';
    });
  }
}