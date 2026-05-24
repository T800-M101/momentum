import { inject, Injectable, signal, computed, effect } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { User } from '../../interfaces/user.interface';
import { AuthResponse } from '../../interfaces/auth-response.interface';
import { environment } from '../../../../environments/environment';
import { JournalService } from '../journal/journal-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private journalService = inject(JournalService);

  private readonly API_URL = environment.apiUrl;

  // --- State Management with Signals ---
  private _closing = signal(false);
  closing = this._closing.asReadonly();

  private _currentUser = signal<User | null>(null);
  currentUser = this._currentUser.asReadonly();

  private _accessToken = signal<string | null>(null);
  accessToken = this._accessToken.asReadonly();

  isAuthenticated = computed(() => this._currentUser() !== null && this._accessToken() !== null);

  constructor() {
    effect(() => {
      const user = this.currentUser();
      if (user) {
        this.journalService.loadStats();
      }
    });

    const savedUser = localStorage.getItem('journal_user_profile');
    if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
      try {
        this._currentUser.set(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing user', e);
        localStorage.removeItem('journal_user_profile');
      }
    }

    const savedToken = localStorage.getItem('journal_token');
    if (savedToken) {
      this._accessToken.set(savedToken);
    }
  }

  /**
   * Send credentials to the API and store the received tokens.
   */
  async login(identifier: string, password: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(
          `${this.API_URL}/auth/login`,
          { identifier, password }
        ),
      );

      this.handleAuthSuccess(response);
      this.journalService.loadStats();
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }

  /**
   * Register a new user and log in automatically.
   */
  async signup(
    userData: User & { password: string },
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(
          `${this.API_URL}/auth/signup`,
          userData
        ),
      );

      this.handleAuthSuccess(response);
      return { success: true };
    } catch (error: any) {
      const serverMessage = error.error?.message || 'Error occurred';
      return {
        success: false,
        message: Array.isArray(serverMessage) ? serverMessage[0] : serverMessage,
      };
    }
  }

  /**
   * Attempt to retrieve a new Access Token using the stored Refresh Token.
   */
  async refreshSession(): Promise<boolean> {
    const refreshToken = localStorage.getItem('journal_refresh_token');
    if (!refreshToken) return false;

    try {
      const response = await firstValueFrom(
        this.http.post<{ access_token: string, refresh_token: string }>(
          `${this.API_URL}/auth/refresh`,
          { refreshToken }
        ),
      );

      if (response && response.access_token) {
        this._accessToken.set(response.access_token);
        localStorage.setItem('journal_token', response.access_token);
        localStorage.setItem('journal_refresh_token', response.refresh_token);
        return true;
      }
      return false;
    } catch {
      this.clearSessionData();
      return false;
    }
  }

  /**
   * Notify the backend to invalidate the session and clear local data.
   */
  logout() {
    this._closing.set(true);

    this.http.post(`${this.API_URL}/auth/logout`, {}).subscribe({
      next: () => console.log('Session cleared on database.'),
      error: (err) => console.error('Logout error', err),
    });

    setTimeout(() => {
      this.clearSessionData();
      this._closing.set(false);
      this.router.navigate(['/login']);
    }, 800);
  }

  private handleAuthSuccess(response: AuthResponse) {
    localStorage.setItem('journal_token', response.access_token);
    localStorage.setItem('journal_refresh_token', response.refresh_token);
    localStorage.setItem('journal_user_profile', JSON.stringify(response.user));

    this._accessToken.set(response.access_token);
    this._currentUser.set(response.user);
  }

  private clearSessionData() {
    this._accessToken.set(null);
    this._currentUser.set(null);
    localStorage.removeItem('journal_token');
    localStorage.removeItem('journal_refresh_token');
    localStorage.removeItem('journal_user_profile');
  }

  async resetPassword(email: string): Promise<any> {
    return firstValueFrom(this.http.post(`${this.API_URL}/auth/forgot-password`, { email }));
  }
}
