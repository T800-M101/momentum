import { inject, Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { User } from '../../interfaces/user.interface';
import { AuthResponse } from '../../interfaces/auth-response.interface';




@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly API_URL = 'http://localhost:3000/auth';

  // --- State Management con Signals ---
  private _closing = signal(false);
  closing = this._closing.asReadonly();

  private _currentUser = signal<User | null>(null);
  currentUser = this._currentUser.asReadonly();

  // The Access Token now lives protected here in RAM (Immune to XSS)
  private _accessToken = signal<string | null>(null);
  accessToken = this._accessToken.asReadonly();

  isAuthenticated = computed(() => this._currentUser() !== null && this._accessToken() !== null);

  constructor() {
    // The public profile (username/email) can persist in localStorage to avoid losing its visual state.
    const savedUser = localStorage.getItem('journal_user_profile');

    if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
      try {
        this._currentUser.set(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parseando el usuario del localStorage', e);
        localStorage.removeItem('journal_user_profile');
      }
    }
  }

  /**
   * Send credentials to the NestJS API using secure cookies.
   */
  async login(identifier: string, password: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(
          `${this.API_URL}/login`,
          { identifier, password },
          { withCredentials: true } // CRITICAL: Allows receiving and storing the HttpOnly Cookie
        ),
      );

      this.handleAuthSuccess(response);
      return true;
    } catch (error) {
      console.error('Authentication login transaction failed:', error);
      return false;
    }
  }

  /**
   * Register a new account and log in automatically.
   */
  async signup(
    userData: User & { password: string },
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(
          `${this.API_URL}/signup`,
          userData,
          { withCredentials: true } // CRITICAL: Allows receiving the HttpOnly Cookie
        ),
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
   * Try to silently retrieve the Access Token using the Rt Cookie.
   * It is invoked automatically when the user presses F5.
   */
  async refreshSession(): Promise<boolean> {
    try {
      // We send the empty request; the browser attaches the cookie on its own.
      const response = await firstValueFrom(
        this.http.post<{ access_token: string }>(
          `${this.API_URL}/refresh`,
          {},
          { withCredentials: true }
        )
      );

      if (response && response.access_token) {
        this._accessToken.set(response.access_token);
        return true;
      }
      return false;
    } catch {
      // If the Refresh Token has already expired on the server, we silently clean everything up.
      this.clearSessionData();
      return false;
    }
  }

  /**
   * Destroy the local credentials and notify the backend.
   */
  logout() {
    this._closing.set(true);

    // We notify NestJS using normal headers (the interceptor will inject the Access Token)
    this.http.post(`${this.API_URL}/logout`, {}, { withCredentials: true }).subscribe({
      next: () => console.log('Session cleared on remote database.'),
      error: (err) => console.error('Failed to invalidate Refresh token remotely', err),
    });

    setTimeout(() => {
      this.clearSessionData();
      this._closing.set(false);
    }, 800);
    this.router.navigate(['/login']);
  }

  // --- Internal Helping Routines ---

  private handleAuthSuccess(response: AuthResponse) {
    // 1. We store the Access Token only in volatile memory
    this._accessToken.set(response.access_token);

    // 2. We store public metadata in localStorage to remember who logged in
    localStorage.setItem('journal_user_profile', JSON.stringify(response.user));
    this._currentUser.set(response.user);
  }

  private clearSessionData() {
    this._accessToken.set(null);
    this._currentUser.set(null);
    localStorage.removeItem('journal_user_profile');
  }
}
