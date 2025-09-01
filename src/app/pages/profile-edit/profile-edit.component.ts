// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { Subject } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';
// import { UserService } from '../../core/user.service';
// import { UserProfile } from '../../models/weather.model';

// @Component({
//   selector: 'app-profile-edit',
//   standalone: true,
//   imports: [CommonModule, FormsModule, ReactiveFormsModule],
//   templateUrl: './profile-edit.component.html',
//   styleUrls: ['./profile-edit.component.scss']
// })
// export class ProfileEditComponent implements OnInit, OnDestroy {
//   profileForm: FormGroup;
//   userProfile: UserProfile | null = null;
//   isLoading = false;
//   isSaving = false;
//   error: string | null = null;
//   success: string | null = null;
//   selectedAvatarFile: File | null = null;
//   avatarPreview: string | null = null;
//   private destroy$ = new Subject<void>();

//   constructor(
//     private fb: FormBuilder,
//     private userService: UserService,
//     private router: Router
//   ) {
//     // Only use fields that exist in your UserProfile
//     this.profileForm = this.fb.group({
//       name: ['', [Validators.required, Validators.minLength(2)]],
//       email: ['', [Validators.required, Validators.email]],
//       // Remove bio, location, phone since they don't exist in your UserProfile
//     });
//   }

//   ngOnInit(): void {
//     this.loadUserProfile();
//   }

//   ngOnDestroy(): void {
//     this.destroy$.next();
//     this.destroy$.complete();
//   }

//   private loadUserProfile(): void {
//     this.isLoading = true;
//     this.userService.userProfile$
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (profile) => {
//           if (profile) {
//             this.userProfile = profile;
//             this.profileForm.patchValue({
//               name: profile.name || '',
//               email: profile.email || '',
//               // Remove references to bio, location, phone
//             });
//             this.avatarPreview = profile.avatar || null;
//           }
//           this.isLoading = false;
//         },
//         error: (error) => {
//           this.error = 'Failed to load profile data';
//           this.isLoading = false;
//         }
//       });
//   }

//   onAvatarChange(event: Event): void {
//     const input = event.target as HTMLInputElement;
//     if (input.files && input.files[0]) {
//       const file = input.files[0];
      
//       // Validate file type
//       if (!file.type.startsWith('image/')) {
//         this.error = 'Please select a valid image file';
//         return;
//       }
      
//       // Validate file size (max 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         this.error = 'Image size must be less than 5MB';
//         return;
//       }
      
//       this.selectedAvatarFile = file;
//       this.error = null;
      
//       // Create preview
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         this.avatarPreview = e.target?.result as string;
//       };
//       reader.readAsDataURL(file);
//     }
//   }

//   removeAvatar(): void {
//     this.selectedAvatarFile = null;
//     this.avatarPreview = this.userProfile?.avatar || null;
//   }

//   onSubmit(): void {
//     if (this.profileForm.invalid || this.isSaving) {
//       return;
//     }

//     this.isSaving = true;
//     this.error = null;
//     this.success = null;

//     const formData = this.profileForm.value;

//     // Update profile data first
//     this.userService.updateProfile(formData)
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (updatedProfile) => {
//           // If avatar was selected, upload it
//           if (this.selectedAvatarFile) {
//             this.uploadAvatar();
//           } else {
//             this.success = 'Profile updated successfully!';
//             this.isSaving = false;
//             setTimeout(() => {
//               this.router.navigate(['/home']);
//             }, 2000);
//           }
//         },
//         error: (error) => {
//           this.error = error.message || 'Failed to update profile';
//           this.isSaving = false;
//         }
//       });
//   }

//   private uploadAvatar(): void {
//     if (!this.selectedAvatarFile) {
//       this.isSaving = false;
//       return;
//     }

//     this.userService.uploadAvatar(this.selectedAvatarFile)
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (updatedProfile) => {
//           this.success = 'Profile and avatar updated successfully!';
//           this.isSaving = false;
//           setTimeout(() => {
//             this.router.navigate(['/home']);
//           }, 2000);
//         },
//         error: (error) => {
//           this.error = error.message || 'Failed to upload avatar';
//           this.isSaving = false;
//         }
//       });
//   }

//   cancel(): void {
//     this.router.navigate(['/home']);
//   }

//   getInitials(): string {
//     if (!this.userProfile?.name) return 'U';
    
//     const names = this.userProfile.name.split(' ');
//     if (names.length >= 2) {
//       return (names[0][0] + names[names.length - 1][0]).toUpperCase();
//     }
//     return names[0][0].toUpperCase();
//   }
// }