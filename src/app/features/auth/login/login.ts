import { Component, effect, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth-service';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

type AuthMode = 'login' | 'signup';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  // --- Animation and UI Signals ---
  unlocking = signal(false);
  turning = signal(false);
  open = signal(false);
  username = signal('');
  password = signal('');
  error = signal('');
  mode = signal<AuthMode>('login');
  email = signal('');
  confirmPassword = signal('');

  private shaking = signal(false);
  isShaking = this.shaking.asReadonly();

  authForm = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    confirmPassword: ['', [Validators.required]],
  });

  constructor() {
    effect(() => {
      if (this.authService.closing()) {
        this.unlocking.set(true);

        setTimeout(() => {
          this.unlocking.set(false);
        }, 700);
      }
    });
  }

  submit() {
    if (this.mode() === 'login') {
      const usernameValid = this.authForm.controls.username.valid;
      const passwordValid = this.authForm.controls.password.valid;

      if (!usernameValid || !passwordValid) {
        this.error.set('Please fill in both Username/Email and Password.');
        this.shake();
        return;
      }
      this.tryLogin();
    } else {
      if (this.authForm.invalid) {
        this.handleFormErrors();
        this.shake();
        return;
      }
      this.trySignup();
    }
  }

  // Toggle between login and signup
  toggleMode() {
    this.mode.set(this.mode() === 'login' ? 'signup' : 'login');
    this.error.set('');
    this.shaking.set(false);

    // Dynamically update validation rules instead of adding/removing controls
    const emailCtrl = this.authForm.controls.email;
    const confirmCtrl = this.authForm.controls.confirmPassword;

    if (this.mode() === 'signup') {
      emailCtrl.setValidators([Validators.required, Validators.email]);
      confirmCtrl.setValidators([Validators.required]);
    } else {
      // Clear validations and values so login succeeds without fields present
      emailCtrl.clearValidators();
      confirmCtrl.clearValidators();
      emailCtrl.setValue('');
      confirmCtrl.setValue('');
    }

    // Force Angular to recalculate validation status across the form
    emailCtrl.updateValueAndValidity();
    confirmCtrl.updateValueAndValidity();
  }

  private async tryLogin() {
    const { username, password } = this.authForm.getRawValue();

    try {
      const ok = await this.authService.login(username!, password!);

      if (ok) {
        this.executeSuccessAnimation();
      } else {
        this.error.set('Invalid credentials or connection issue.');
        this.shake();
      }
    } catch (err) {
      console.error('🚨 ERROR CRÍTICO EN EL COMPONENTE:', err);
    }
  }

  private async trySignup() {
    const { username, password, email, confirmPassword } = this.authForm.getRawValue();

    if (password !== confirmPassword) {
      this.error.set('Passwords do not match.');
      this.shake();
      return;
    }

    if (password && password.length < 6) {
      this.error.set('Password must be at least 6 characters.');
      this.shake();
      return;
    }

    try {
      const result = await this.authService.signup({
        username: username!,
        password: password!,
        email: email!,
      });

      if (result.success) {
        this.executeSuccessAnimation();
      } else {
        this.error.set('Username or Email already exists.');
        this.shake();
      }

    } catch (err) {
        this.error.set('Could not connect to the authentication server.');
        this.shake();
    }
  }

  private handleFormErrors() {
    const controls = this.authForm.controls;

    if (controls.username.errors?.['required'] || controls.password.errors?.['required']) {
      this.error.set('Please fill in both Username and Password.');
      return;
    }

    // Secondary signup-specific check if fields are present in current abstract control mapping
    if (this.mode() === 'signup') {
      const emailCtrl = this.authForm.get('email');
      if (emailCtrl?.errors?.['required']) {
        this.error.set('Please fill in all fields.');
      } else if (emailCtrl?.errors?.['email']) {
        this.error.set('Please enter a valid email address.');
      }
    }
  }

  private executeSuccessAnimation() {
    this.error.set('');
    this.unlocking.set(true);

    setTimeout(() => this.turning.set(true), 500);
    setTimeout(() => this.open.set(true), 800);
    setTimeout(() => this.router.navigate(['/']), 2200);
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.submit();
    }
  }

  private shake() {
    this.shaking.set(true);
    setTimeout(() => this.shaking.set(false), 400);
  }
}
