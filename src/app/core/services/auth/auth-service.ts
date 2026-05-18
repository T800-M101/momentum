import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  router = inject(Router);
  private _closing = signal(false);

  closing = this._closing.asReadonly();

  private users = signal<User[]>([
    { username: 'demo', password: 'demo123', email: 'demo@example.com' },
  ]);

  private _currentUser = signal<User | null>(null);
  currentUser = this._currentUser.asReadonly();

  constructor() {
    const savedUsers = localStorage.getItem('journal_users');
    if (savedUsers) {
      this.users.set(JSON.parse(savedUsers));
    }

    const session = localStorage.getItem('journal_session');
    if (session) {
      const user = JSON.parse(session);
      this._currentUser.set(user);
    }
  }

  login(username: string, password: string): boolean {
    const user = this.users().find((u) => u.username === username && u.password === password);

    if (user) {
      this._currentUser.set(user);
      localStorage.setItem('journal_session', JSON.stringify(user));
      return true;
    }
    return false;
  }

  signup(userData: Omit<User, 'id'>): boolean {
    const userExists = this.users().some((u) => u.username === userData.username);

    if (userExists) {
      return false;
    }

    const newUser = { ...userData };
    const updatedUsers = [...this.users(), newUser];
    this.users.set(updatedUsers);

    localStorage.setItem('journal_users', JSON.stringify(updatedUsers));

    this._currentUser.set(newUser);
    localStorage.setItem('journal_session', JSON.stringify(newUser));

    return true;
  }

  logout() {
    this._closing.set(true);

    setTimeout(() => {
      this._currentUser.set(null);
      localStorage.removeItem('journal_session');
      this._closing.set(false);
    }, 800);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this._currentUser() !== null;
  }
}
