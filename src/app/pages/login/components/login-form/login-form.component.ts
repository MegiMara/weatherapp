import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/auth.service'; // rregullo path sipas strukturës
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {
  isLoginMode = true;
  loginForm: FormGroup;
  registerForm: FormGroup;
  showPassword = false;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.showPassword = false;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

 async onSubmit() {
  if (this.isLoginMode && this.loginForm.valid) {
    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    try {
      // ✅ përdor lastValueFrom për Observable modern
      await lastValueFrom(this.authService.login(email, password, true));
      this.router.navigate(['/home']); // redirect pas login
    } catch (err: any) {
      alert(`Login failed! ${err?.error?.message || ''}`);
      console.error(err);
    } finally {
      this.isLoading = false;
    }

  } else if (!this.isLoginMode && this.registerForm.valid) {
    this.isLoading = true;
    const { username, email, password } = this.registerForm.value;

    try {
      await lastValueFrom(this.authService.register({
        firstName: username,
        lastName: 'test',
        email:email,
        password,
        subscribeNewsletter: false
      }));

      alert('Registration successful! Please log in.');
      this.toggleMode(); // kalon në login pas regjistrimit
    } catch (err: any) {
      alert(`Registration failed! ${err?.error?.message || ''}`);
      console.error(err);
    } finally {
      this.isLoading = false;
    }
  }
}

  getFieldError(fieldName: string, form: FormGroup): string {
    const field = form.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} is required`;
      if (field.errors['email']) return 'Please enter a valid email address';
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `${this.getFieldLabel(fieldName)} must be at least ${requiredLength} characters`;
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'username': 'Username',
      'email': 'Email',
      'password': 'Password'
    };
    return labels[fieldName] || fieldName;
  }
}


