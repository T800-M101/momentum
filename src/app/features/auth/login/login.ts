import { Component, effect, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth-service';
import { Router } from '@angular/router';

type AuthMode = 'login' | 'signup';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  authService = inject(AuthService);

  unlocking = signal(false);
  turning = signal(false);
  open = signal(false);
  username = signal('');
  password = signal('');
  error = signal('');

  mode = signal<AuthMode>('login');
  email = signal('');
  confirmPassword = signal('');

  private router = inject(Router);
  private shaking = signal(false);
  isShaking = this.shaking.asReadonly();

  constructor(){
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
      this.tryLogin();
    } else {
      this.trySignup();
    }
  }

  // Toggle between login and signup
  toggleMode() {
    this.mode.set(this.mode() === 'login' ? 'signup' : 'login');
    this.error.set('');
    this.shaking.set(false);

    if (this.mode() === 'login') {
      this.email.set('');
      this.confirmPassword.set('');
    }
  }

  private tryLogin() {
    if (!this.username() || !this.password()) {
      this.error.set('Please fill in both fields.');
      this.shake();
      return;
    }

    const ok = this.authService.login(this.username(), this.password());

    if (ok) {
      this.error.set('');
      this.unlocking.set(true);

      setTimeout(() => this.turning.set(true), 500);
      setTimeout(() => this.open.set(true), 800);
      setTimeout(() => this.router.navigate(['/']), 2200);
    } else {
      this.error.set('Invalid credentials.');
      this.shake();
    }
  }

  private trySignup() {
    if (!this.username() || !this.password() || !this.email()) {
      this.error.set('Please fill in all fields.');
      this.shake();
      return;
    }

    if (this.password() !== this.confirmPassword()) {
      this.error.set('Passwords do not match.');
      this.shake();
      return;
    }

    if (this.password().length < 6) {
      this.error.set('Password must be at least 6 characters.');
      this.shake();
      return;
    }

    if (!this.email().includes('@') || !this.email().includes('.')) {
      this.error.set('Please enter a valid email address.');
      this.shake();
      return;
    }

    const success = this.authService.signup({
      username: this.username(),
      password: this.password(),
      email: this.email(),
    });

    if (success) {
      this.error.set('');
      this.unlocking.set(true);

      setTimeout(() => this.turning.set(true), 500);
      setTimeout(() => this.open.set(true), 800);
      setTimeout(() => this.router.navigate(['/']), 2200);
    } else {
      this.error.set('Username already exists.');
      this.shake();
    }
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
