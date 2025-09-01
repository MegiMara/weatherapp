import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '../../../../core/user.service';
import { UserProfile } from '../../../../models/weather.model';

@Component({
  selector: 'app-profile-picture',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.scss']
})
export class ProfilePictureComponent implements OnInit, OnDestroy {
  profileForm: FormGroup;
  isSaving = false;
  error: string | null = null;
  success: string | null = null;
  selectedAvatarFile: File | null = null;
  avatarPreview: string | null = null;
  private destroy$ = new Subject<void>();

  // Mock user profile for testing - replace with real data loading
  private mockUserProfile: UserProfile = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '', // Empty means use default avatar
    favoritesCities: []
  };

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
    // For now, use mock data - replace this with real UserService call
    const profile = this.mockUserProfile;
    
    this.profileForm.patchValue({
      name: profile.name || '',
      email: profile.email || '',
      password: ''
    });
    
    // Set avatar preview (use provided avatar or default)
    this.avatarPreview = profile.avatar || this.getDefaultAvatar();
    
    // Uncomment this when your UserService is working:
    /*
    this.userService.userProfile$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: profile => {
          if (profile) {
            this.profileForm.patchValue({
              name: profile.name || '',
              email: profile.email || '',
              password: ''
            });
            this.avatarPreview = profile.avatar || this.getDefaultAvatar();
          }
        },
        error: (error) => {
          console.error('Error loading profile:', error);
          this.error = 'Failed to load profile data';
        }
      });
    */
  }

  onAvatarChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.error = 'Please select a valid image file (JPG, PNG, GIF)';
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.error = 'Image size must be less than 5MB';
        return;
      }
      
      this.selectedAvatarFile = file;
      this.error = null;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.avatarPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeAvatar(): void {
    this.selectedAvatarFile = null;
    this.avatarPreview = this.getDefaultAvatar();
    
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid || this.isSaving) return;

    this.isSaving = true;
    this.error = null;
    this.success = null;

    const formData = this.profileForm.value;
    const updateData: any = {
      name: formData.name,
      email: formData.email
    };
    
    if (formData.password?.trim()) {
      updateData.password = formData.password;
    }

    // Mock successful update - replace with real service call
    setTimeout(() => {
      if (this.selectedAvatarFile) {
        // Mock avatar upload
        this.uploadAvatar();
      } else {
        this.success = 'Profile updated successfully!';
        this.isSaving = false;
        // Update mock data
        this.mockUserProfile.name = updateData.name;
        this.mockUserProfile.email = updateData.email;
        this.clearSuccessMessage();
      }
    }, 1500);

    // Uncomment this when your UserService is working:
    /*
    this.userService.updateProfile(updateData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          if (this.selectedAvatarFile) {
            this.uploadAvatar();
          } else {
            this.success = 'Profile updated successfully!';
            this.isSaving = false;
            this.clearSuccessMessage();
          }
        },
        error: (err) => {
          this.error = err.message || 'Failed to update profile';
          this.isSaving = false;
        }
      });
    */
  }

  private uploadAvatar(): void {
    if (!this.selectedAvatarFile) return;

    // Mock avatar upload - replace with real service call
    setTimeout(() => {
      this.success = 'Profile and avatar updated successfully!';
      this.isSaving = false;
      this.selectedAvatarFile = null;
      this.clearSuccessMessage();
    }, 2000);

    // Uncomment this when your UserService is working:
    /*
    this.userService.uploadAvatar(this.selectedAvatarFile)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.success = 'Profile and avatar updated successfully!';
          this.isSaving = false;
          this.selectedAvatarFile = null;
          this.clearSuccessMessage();
        },
        error: (err) => {
          this.error = err.message || 'Failed to upload avatar';
          this.isSaving = false;
        }
      });
    */
  }

  logout(): void {
    if (!confirm('Are you sure you want to logout?')) return;
    
    // Mock logout - replace with real service call
    this.router.navigate(['/login']);
    
    // Uncomment this when your UserService is working:
    /*
    this.userService.logout().pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.userService.setUserProfile(null);
        this.router.navigate(['/login']);
      },
      error: () => {
        this.userService.setUserProfile(null);
        this.router.navigate(['/login']);
      }
    });
    */
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

  // Helper methods
  getUserDisplayName(): string {
    return this.mockUserProfile?.name || 'User';
  }

  getDefaultAvatar(): string {
    // Return empty string to show the SVG icon instead
    return '';
  }

  private clearSuccessMessage(): void {
    setTimeout(() => {
      this.success = null;
    }, 3000);
  }
}




