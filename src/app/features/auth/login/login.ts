import { Component, effect, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth-service';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { IconsService } from '../../../core/services/icons/icons-service';
import { ToastrService } from '../../../core/services/toastr/toastr-service';

type AuthMode = 'login' | 'signup';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, LucideAngularModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private iconsService = inject(IconsService);
  private toastr = inject(ToastrService);
  icons = this.iconsService.icons;

  // ── Animation signals ──────────────────────────────
  unlocking = signal(false);
  turning   = signal(false);
  open      = signal(false);
  error     = signal('');
  mode      = signal<AuthMode>('login');

  private shaking = signal(false);
  isShaking = this.shaking.asReadonly();

  showPassword        = signal(false);
  showConfirmPassword = signal(false);

  // ── Form ───────────────────────────────────────────
  authForm = this.fb.nonNullable.group({
    username:        ['', [Validators.required]],
    password:        ['', [Validators.required]],
    email:           [''],
    confirmPassword: [''],
  });

  constructor() {
    effect(() => {
      if (this.authService.closing()) {
        this.unlocking.set(true);
        setTimeout(() => this.unlocking.set(false), 700);
      }
    });
  }

  // ── Submit ─────────────────────────────────────────
  async submit() {
    this.error.set('');

    if (this.mode() === 'login') {
      const { username, password } = this.authForm.controls;
      username.markAsTouched();
      password.markAsTouched();

      if (username.invalid || password.invalid) {
        this.handleFormErrors();
        this.shake();
        return;
      }

      await this.tryLogin();

    } else {
      this.authForm.markAllAsTouched();

      if (this.authForm.invalid) {
        this.handleFormErrors();
        this.shake();
        return;
      }

      await this.trySignup();
    }
  }

  // ── Mode toggle ────────────────────────────────────
  toggleMode(targetMode: AuthMode) {
    this.mode.set(targetMode);
    this.error.set('');
    this.shaking.set(false);
    this.authForm.reset();

    const { email, username, password, confirmPassword } = this.authForm.controls;

    if (targetMode === 'signup') {
      email.setValidators([Validators.required, Validators.email]);
      confirmPassword.setValidators([Validators.required]);
    } else {
      email.clearValidators();
      confirmPassword.clearValidators();
    }

    username.setValidators([Validators.required]);
    password.setValidators([Validators.required]);

    email.updateValueAndValidity();
    username.updateValueAndValidity();
    password.updateValueAndValidity();
    confirmPassword.updateValueAndValidity();
  }

  goBackToLogin() {
    this.toggleMode('login');
  }

  // ── Login ──────────────────────────────────────────
  private async tryLogin() {
    const { username, password } = this.authForm.getRawValue();
    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    try {
      const ok = await this.authService.login(cleanUsername, cleanPassword);

      if (ok) {
        this.executeSuccessAnimation();
      } else {
        this.error.set('Invalid credentials or connection issue.');
        this.shake();
      }
    } catch (err) {
      console.error('Login error:', err);
      this.error.set('Could not connect to the server.');
      this.shake();
    }
  }

  // ── Signup ─────────────────────────────────────────
  private async trySignup() {
    const { username, password, email, confirmPassword } = this.authForm.getRawValue();

    if (password !== confirmPassword) {
      this.error.set('Passwords do not match.');
      this.shake();
      return;
    }

    if (password.length < 6) {
      this.error.set('Password must be at least 6 characters.');
      this.shake();
      return;
    }

    try {
      const result = await this.authService.signup({
        username,
        password,
        email,
      });

      if (result.success) {
        this.executeSuccessAnimation();
      } else {
        this.error.set(result.message ?? 'Username or Email already exists.');
        this.shake();
      }
    } catch (err) {
      console.error('Signup error:', err);
      this.error.set('Could not connect to the authentication server.');
      this.shake();
    }
  }

  // ── Form error messages ────────────────────────────
  private handleFormErrors() {
    const { username, password, email, confirmPassword } = this.authForm.controls;

    if (username.errors?.['required'] && password.errors?.['required']) {
      this.error.set('Please fill in all required fields.');
      return;
    }

    if (username.errors?.['required']) {
      this.error.set('Username is required.');
      return;
    }

    if (password.errors?.['required']) {
      this.error.set('Password is required.');
      return;
    }

    if (this.mode() === 'signup') {
      if (email.errors?.['required']) {
        this.error.set('Email is required.');
        return;
      }
      if (email.errors?.['email']) {
        this.error.set('Please enter a valid email address.');
        return;
      }
      if (confirmPassword.errors?.['required']) {
        this.error.set('Please confirm your password.');
        return;
      }
    }
  }

  // ── Animation ──────────────────────────────────────
  private executeSuccessAnimation() {
    this.error.set('');
    this.unlocking.set(true);

    setTimeout(() => this.turning.set(true), 500);
    setTimeout(() => this.open.set(true), 800);
    setTimeout(() => this.router.navigate(['/']), 2200);
  }

  // ── Helpers ────────────────────────────────────────
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') this.submit();
  }

  private shake() {
    this.shaking.set(true);
    setTimeout(() => this.shaking.set(false), 400);
  }

  togglePasswordVisibility() {
    this.showPassword.update(v => !v);
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword.update(v => !v);
  }

  forgotPassword():void {

  }
}
