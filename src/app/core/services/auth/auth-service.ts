import { inject, Injectable, signal, computed, effect } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { User } from '../../interfaces/user.interface';
import { AuthResponse } from '../../interfaces/auth-response.interface';
import { environment } from '../../../../environments/environment.development';
import { JournalService } from '../journal/journal-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private journalService = inject(JournalService);

  private readonly API_URL = environment.apiUrl;

  // ── State ───────────────────────────────────────────
  private _closing = signal(false);
  closing = this._closing.asReadonly();

  private _currentUser = signal<User | null>(null);
  currentUser = this._currentUser.asReadonly();

  // Access Token vive en RAM — inmune a XSS
  private _accessToken = signal<string | null>(null);
  accessToken = this._accessToken.asReadonly();

  isAuthenticated = computed(() => this._currentUser() !== null && this._accessToken() !== null);

  constructor() {
    const savedUser = localStorage.getItem('journal_user_profile');
    if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
      try {
        this._currentUser.set(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing user profile:', e);
        localStorage.removeItem('journal_user_profile');
      }
    }

    window.addEventListener('storage', (event) => {
      if (event.key === null || event.key === 'journal_user_profile') {
        if (!event.newValue) {
          this.clearSessionData();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  /**
   * Login with credentials — receive Access Token + set RT Cookie.
   */
  async login(identifier: string, password: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(
          `${this.API_URL}/auth/login`,
          { identifier, password },
          { withCredentials: true },
        ),
      );

      this.handleAuthSuccess(response);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }

  /**
   * Registration — creates an account and authenticates automatically.
   */
  async signup(
    userData: User & { password: string },
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(`${this.API_URL}/auth/signup`, userData, {
          withCredentials: true,
        }),
      );

      this.handleAuthSuccess(response);
      return { success: true };
    } catch (error: any) {
      console.error('Signup failed:', error);
      const serverMessage = error.error?.message || 'An unexpected error occurred.';
      return {
        success: false,
        message: Array.isArray(serverMessage) ? serverMessage[0] : serverMessage,
      };
    }
  }

  /**
   * Retrieve the Access Token silently using the RT Cookie.
   * It is automatically invoked on every F5 via provideAppInitializer.
   */
  async refreshSession(): Promise<boolean> {
    if (this._accessToken()) return true;

    const savedToken = localStorage.getItem('journal_token');
    if (savedToken) {
      this._accessToken.set(savedToken);
      const savedUser = localStorage.getItem('journal_user_profile');
      if (savedUser) this._currentUser.set(JSON.parse(savedUser));
      this.journalService.loadStats();
      return true;
    }

    try {
      const response = await firstValueFrom(
        this.http.post<{ access_token: string }>(
          `${this.API_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        ),
      );

      if (response?.access_token) {
        this._accessToken.set(response.access_token);
        const savedUser = localStorage.getItem('journal_user_profile');
        if (savedUser) this._currentUser.set(JSON.parse(savedUser));
        this.journalService.loadStats();
        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ Refresh failed:', error);
      this.clearSessionData();
      return false;
    }
  }

  /**
   * Log out — notifies the backend and clears the local state.
   */
  logout() {
    this._closing.set(true);

    this.http.post(`${this.API_URL}/auth/logout`, {}, { withCredentials: true }).subscribe({
      next: () => console.log('Remote session invalidated.'),
      error: (err) => console.error('Remote logout failed:', err),
    });

    setTimeout(() => {
      this.clearSessionData();
      this._closing.set(false);
    }, 800);
    this.router.navigate(['/login']);
  }

  // ── Helpers privados ────────────────────────────────

  private handleAuthSuccess(response: AuthResponse) {
    localStorage.setItem('journal_user_profile', JSON.stringify(response.user));
    localStorage.setItem('journal_token', response.access_token);
    this._accessToken.set(response.access_token);
    this._currentUser.set(response.user);
  }

  private clearSessionData() {
    this._accessToken.set(null);
    this._currentUser.set(null);
    localStorage.removeItem('journal_user_profile');
    localStorage.removeItem('journal_token');
  }
}
