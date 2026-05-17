import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth-service';
import { Router } from '@angular/router';

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
  turning   = signal(false);
  open      = signal(false);
  username  = signal('');
  password  = signal('');
  error     = signal('');

  private router = inject(Router);
  private shaking = signal(false);
  isShaking = this.shaking.asReadonly();

  tryLogin() {
    if (!this.username() || !this.password()) {
      this.error.set('Please fill in both fields.');
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

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') this.tryLogin();
  }

  private shake() {
    this.shaking.set(true);
    setTimeout(() => this.shaking.set(false), 400);
  }
}
