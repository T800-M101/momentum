import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _loggedIn = signal(!!sessionStorage.getItem('auth'));
  router = inject(Router);

  isLoggedIn = this._loggedIn.asReadonly();

  login(username: string, password: string): boolean {
    if (username === 'memo' && password === '1234') {
      sessionStorage.setItem('auth', '1');
      this._loggedIn.set(true);
      return true;
    }
    return false;
  }

  logout() {
    sessionStorage.removeItem('auth');
    this._loggedIn.set(false);
    this.router.navigate(['/login']);
  }

}
