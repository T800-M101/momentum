import { Component, effect, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('momentum');
  constructor() {
    const authService = inject(AuthService);
    const router = inject(Router);

    effect(() => {
      if (!authService.isAuthenticated()) {
        router.navigate(['/login']);
      }
    });
  }
}
