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
  // --- Animation and UI Signals ---
  unlocking = signal(false);
  turning = signal(false);
  open = signal(false);
  username = signal('');
  password = signal('');
  error = signal('');
  mode = signal<'login' | 'signup' | 'forgot'>('login');
  email = signal('');
  confirmPassword = signal('');

  private shaking = signal(false);
  isShaking = this.shaking.asReadonly();

  showPassword = signal(false);
  showConfirmPassword = signal(false);

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

 async submit() {
  if (this.mode() === 'forgot') {
    const emailCtrl = this.authForm.controls.email;

    if (emailCtrl.invalid) {
      emailCtrl.markAsTouched();
      this.shaking.set(true);
      return;
    }

    try {
      await this.authService.resetPassword(emailCtrl.value);
      this.toastr.show('We have sent a link to your email to reset your password', 'success');
    } catch (err) {
      this.toastr.show('Something went wrong. Please try again later.', 'error');
    }
    return;
  }

  if (this.authForm.invalid) {
    this.authForm.markAllAsTouched();
    this.shaking.set(true);
    return;
  }

  if (this.mode() === 'login') {
    this.tryLogin();
  } else {
    this.trySignup();
  }
}

 toggleMode(targetMode: 'login' | 'signup' | 'forgot' = 'login') {
  if (targetMode === 'forgot') {
    this.mode.set('forgot');
  } else {
    this.mode.set(this.mode() === 'login' ? 'signup' : 'login');
  }

  this.error.set('');
  this.shaking.set(false);

  const emailCtrl = this.authForm.controls.email;
  const userCtrl = this.authForm.controls.username;
  const passCtrl = this.authForm.controls.password;
  const confirmCtrl = this.authForm.controls.confirmPassword;

  if (this.mode() === 'signup') {
    emailCtrl.setValidators([Validators.required, Validators.email]);
    userCtrl.setValidators([Validators.required]);
    passCtrl.setValidators([Validators.required]);
    confirmCtrl.setValidators([Validators.required]);
  }
  else if (this.mode() === 'forgot') {
    emailCtrl.setValidators([Validators.required, Validators.email]);

    this.authForm.controls.username.clearValidators();
    this.authForm.controls.password.clearValidators();
    this.authForm.controls.confirmPassword.clearValidators();

    this.authForm.patchValue({
      username: '',
      password: '',
      confirmPassword: ''
    });

    this.authForm.controls.username.updateValueAndValidity();
    this.authForm.controls.password.updateValueAndValidity();
    this.authForm.controls.confirmPassword.updateValueAndValidity();
    emailCtrl.updateValueAndValidity();
  }
  else {
    emailCtrl.clearValidators();
    userCtrl.setValidators([Validators.required]);
    passCtrl.setValidators([Validators.required]);
    confirmCtrl.clearValidators();
  }

  emailCtrl.updateValueAndValidity();
  userCtrl.updateValueAndValidity();
  passCtrl.updateValueAndValidity();
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

  togglePasswordVisibility() {
    this.showPassword.update((v) => !v);
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword.update((v) => !v);
  }

  forgotPassword() {
    this.mode.set('forgot');
  }

  goBackToLogin() {
    this.mode.set('login');
  }
}
