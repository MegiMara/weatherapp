import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '../../../../core/user.service';
import { UserProfile } from '../../../../models/weather.model';

@Component({
  selector: 'picture-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl:'profile-picture.component.html',
  styleUrls: ['./profile-picture.component.scss']
})
export class ProfilePictureComponent implements OnInit, OnDestroy {
  userProfile: UserProfile | null = null;
  profileForm: FormGroup;
  isLoading = false;
  isSaving = false;
  error: string | null = null;
  success: string | null = null;
  selectedAvatarFile: File | null = null;
  avatarPreview: string | null = null;
  isEditing = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public router: Router
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['']
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUserProfile(): void {
    this.isLoading = true;
    this.userService.userProfile$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: profile => {
          if (profile) {
            this.userProfile = profile;
            this.profileForm.patchValue({
              name: (profile as any).username || profile.name || '',
              email: profile.email || '',
              password: ''
            });
            this.avatarPreview = (profile as any).avatar || null;
          }
          this.isLoading = false;
        },
        error: () => {
          this.error = 'Failed to load profile data';
          this.isLoading = false;
        }
      });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    this.error = null;
    this.success = null;
    this.profileForm.patchValue({ password: '' });
  }

  onAvatarChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) {
        this.error = 'Please select a valid image file';
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.error = 'Image size must be less than 5MB';
        return;
      }
      this.selectedAvatarFile = file;
      this.error = null;
      const reader = new FileReader();
      reader.onload = (e) => this.avatarPreview = e.target?.result as string;
      reader.readAsDataURL(file);
    }
  }

  removeAvatar(): void {
    this.selectedAvatarFile = null;
    this.avatarPreview = (this.userProfile as any)?.avatar || null;
  }

  onSubmit(): void {
    if (this.profileForm.invalid || this.isSaving) return;

    this.isSaving = true;
    this.error = null;
    this.success = null;

    const formData = this.profileForm.value;
    const updateData: any = {
      username: formData.name,
      email: formData.email
    };
    if (formData.password?.trim()) updateData.password = formData.password;

    this.userService.updateProfile(updateData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          if (this.selectedAvatarFile) {
            this.uploadAvatar();
          } else {
            this.success = 'Profile updated successfully!';
            this.isSaving = false;
            this.isEditing = false;
          }
        },
        error: (err) => {
          this.error = err.message || 'Failed to update profile';
          this.isSaving = false;
        }
      });
  }

  private uploadAvatar(): void {
    if (!this.selectedAvatarFile) return;

    this.userService.uploadAvatar(this.selectedAvatarFile)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.success = 'Profile and avatar updated successfully!';
          this.isSaving = false;
          this.isEditing = false;
          this.selectedAvatarFile = null;
        },
        error: (err) => {
          this.error = err.message || 'Failed to upload avatar';
          this.isSaving = false;
        }
      });
  }

  cancel(): void {
    this.isEditing = false;
    this.error = null;
    this.success = null;
    this.selectedAvatarFile = null;
    this.avatarPreview = (this.userProfile as any)?.avatar || null;
    if (this.userProfile) {
      this.profileForm.patchValue({
        name: (this.userProfile as any).username || this.userProfile.name || '',
        email: this.userProfile.email || '',
        password: ''
      });
    }
  }

  logout(): void {
    if (!confirm('Are you sure you want to logout?')) return;
    this.userService.logout().pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.userService.setUserProfile(null);
        this.router.navigate(['/login']);
      },
      error: () => this.router.navigate(['/login'])
    });
  }

  /** Template helper methods */
  getInitials(): string {
    const name = (this.userProfile as any)?.username || this.userProfile?.name;
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length >= 2) return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    return names[0][0].toUpperCase();
  }

  getUserDisplayName(): string {
    return (this.userProfile as any)?.username || this.userProfile?.name || 'User';
  }

  hasAvatar(): boolean {
    return !!(this.avatarPreview && this.avatarPreview !== 'assets/default-avatar.png');
  }
}





