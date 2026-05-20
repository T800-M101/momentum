import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable, tap } from 'rxjs';

// Matching your modern Prisma architecture types
export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // API endpoint targeting your NestJS backend server running locally
  private readonly API_URL = 'http://localhost:3000/auth';

  // --- Signals State Management ---
  private _closing = signal(false);
  closing = this._closing.asReadonly();

  private _currentUser = signal<User | null>(null);
  currentUser = this._currentUser.asReadonly();

  constructor() {
    const savedUser = localStorage.getItem('user');

    if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
      try {
        this._currentUser.set(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parseando el usuario del localStorage', e);
        localStorage.removeItem('user');
      }
    } else {
      this._currentUser.set(null);
    }
  }

  /**
   * Sends user credentials to the API.
   * Converted to Promises to fit smoothly into your Login Component's tryLogin method structure.
   */
  async login(identifier: string, password: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(`${this.API_URL}/login`, { identifier, password }),
      );

      this.handleAuthSuccess(response);
      return true;
    } catch (error) {
      console.error('Authentication login transaction failed:', error);
      return false;
    }
  }

  /**
   * Registers a brand new account inside your PostgreSQL instance.
   */
  async signup(
    userData: Omit<User, 'id'> & { password: string },
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(`${this.API_URL}/signup`, userData),
      );

      this.handleAuthSuccess(response);
      return { success: true };
    } catch (error: any) {
      console.error('Registration signup transaction failed:', error);
      const serverMessage = error.error?.message || 'An unexpected error occurred.';
      return {
        success: false,
        message: Array.isArray(serverMessage) ? serverMessage[0] : serverMessage,
      };
    }
  }

  /**
   * Destroys credentials and executes the lock-dropping window animations.
   */
  logout() {
    this._closing.set(true);

    // Optional: Make a network request to backend to clean up hashedRt from DB
    this.http.post(`${this.API_URL}/logout`, {}).subscribe({
      next: () => console.log('Session cleared on remote database.'),
      error: (err) => console.error('Failed to invalidate Refresh token remotely', err),
    });

    setTimeout(() => {
      // Flush client side authorization memory tokens
      this._currentUser.set(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('journal_user_profile');

      this._closing.set(false);
    }, 800);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this._currentUser() !== null && localStorage.getItem('access_token') !== null;
  }

  // --- Helper Routines ---

  private handleAuthSuccess(response: AuthResponse) {
    localStorage.setItem('access_token', (response as any).access_token);
    localStorage.setItem('refresh_token', (response as any).refresh_token);
    localStorage.setItem('user', JSON.stringify(response.user));

    this._currentUser.set(response.user);
  }
}
