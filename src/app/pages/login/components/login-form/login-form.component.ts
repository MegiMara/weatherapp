/*
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {
  isLoginMode = true;
  loginForm: FormGroup;
  registerForm: FormGroup;
  showPassword = false;
  isLoading = false;

  constructor(private formBuilder: FormBuilder) {
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

  onSubmit() {
    if (this.isLoginMode && this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;
      console.log('Login attempt:', { email, password });
      
      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        // Handle login logic here
      }, 2000);
      
    } else if (!this.isLoginMode && this.registerForm.valid) {
      this.isLoading = true;
      const { username, email, password } = this.registerForm.value;
      console.log('Register attempt:', { username, email, password });
      
      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        // Handle register logic here
      }, 2000);
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
} */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'] // fixed typo from styleUrl to styleUrls
})
export class LoginFormComponent {
  isLoginMode = true;
  loginForm: FormGroup;
  registerForm: FormGroup;
  showPassword = false;
  isLoading = false;

  constructor(private formBuilder: FormBuilder, private router: Router) {
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

  onSubmit() {
    if (this.isLoginMode && this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;
      console.log('Login attempt:', { email, password });
      
      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        // Redirect to home page after login
        this.router.navigate(['/home']);
      }, 2000);
      
    } else if (!this.isLoginMode && this.registerForm.valid) {
      this.isLoading = true;
      const { username, email, password } = this.registerForm.value;
      console.log('Register attempt:', { username, email, password });
      
      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        // Optional: redirect to login page or home after registration
        this.router.navigate(['/home']); 
      }, 2000);
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
