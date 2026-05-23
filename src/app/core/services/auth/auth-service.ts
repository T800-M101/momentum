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

  // --- State Management ---
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

    // Recuperar perfil y token desde localStorage al iniciar
    const savedUser = localStorage.getItem('journal_user_profile');
    const savedToken = localStorage.getItem('journal_token');

    if (savedUser) {
      try {
        this._currentUser.set(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing user profile', e);
        localStorage.removeItem('journal_user_profile');
      }
    }

    if (savedToken) {
      this._accessToken.set(savedToken);
    }

    // Listener para sincronización entre pestañas
    window.addEventListener('storage', (event) => {
      if (event.key === 'journal_user_profile' && !event.newValue) {
        this.clearSessionData();
        this.router.navigate(['/login']);
      }
    });
  }

  async login(identifier: string, password: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, { identifier, password }, { withCredentials: true }),
      );
      this.handleAuthSuccess(response);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }

  async refreshSession(): Promise<boolean> {
    if (this._accessToken()) return true;

    try {
      const response = await firstValueFrom(
        this.http.post<{ access_token: string }>(`${this.API_URL}/auth/refresh`, {}, { withCredentials: true }),
      );

      if (response?.access_token) {
        this._accessToken.set(response.access_token);
        localStorage.setItem('journal_token', response.access_token);
        return true;
      }
      return false;
    } catch {
      this.clearSessionData();
      return false;
    }
  }

  logout() {
    this._closing.set(true);
    this.http.post(`${this.API_URL}/auth/logout`, {}, { withCredentials: true }).subscribe();
    setTimeout(() => {
      this.clearSessionData();
      this._closing.set(false);
      this.router.navigate(['/login']);
    }, 800);
  }

  private handleAuthSuccess(response: AuthResponse) {
    this._accessToken.set(response.access_token);
    this._currentUser.set(response.user);

    localStorage.setItem('journal_token', response.access_token);
    localStorage.setItem('journal_user_profile', JSON.stringify(response.user));
  }

  private clearSessionData() {
    this._accessToken.set(null);
    this._currentUser.set(null);
    localStorage.removeItem('journal_token');
    localStorage.removeItem('journal_user_profile');
  }
}
