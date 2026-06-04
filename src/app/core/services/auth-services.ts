import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalStorageServices } from './local-storage-services';
import { UserRegister, UserResponse, UserSession } from '../../features/user/user.model';
import { LoginPayload, LoginResponse, AuthSession } from '../../features/auth/auth.model';
import { firstValueFrom, Observable, tap } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

const AUTH_STORAGE_KEY = 'blackened-app-auth';
const VALID_ROLES = ['admin', 'staff', 'user'];

export interface RefreshAccessTokenResponse {
  accessToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthServices {

  private readonly apiUrl = `${API_BASE_URL}/auth`;

  private readonly http = inject(HttpClient);
  private readonly storage = inject(LocalStorageServices);

  private readonly sessionSignal = signal<AuthSession | null>(null);
  readonly session = this.sessionSignal.asReadonly();

  constructor() {
    const restored = this.restoreSession();
    if (restored) {
      this.sessionSignal.set(restored);
    }
  }

  isLoggedIn(): boolean {
    return !!this.sessionSignal();
  } 

  getCurrentUser(): UserSession | null {
    return this.sessionSignal()?.user ?? null;
  }

  getAccessToken(): string | null {
    return this.sessionSignal()?.accessToken ?? null;
  }

  async login(payload: LoginPayload): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<LoginResponse>(
        `${this.apiUrl}/login`,
        payload,
        { withCredentials: true }
      )
    );

    const session: AuthSession = {
      accessToken: response.accessToken,
      user: response.user
    };
    this.persistSession(session);
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post<void>(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      );
    } finally {
      this.clearSession();
    }
  }

  refreshAccessToken(): Observable<RefreshAccessTokenResponse> {
    return this.http.post<RefreshAccessTokenResponse>(
      `${this.apiUrl}/refresh`,
      {},
      { withCredentials: true }
    ).pipe(
      tap((response) => {
        const currentUser = this.getCurrentUser();

        if (currentUser) {
          this.persistSession({
            accessToken: response.accessToken,
            user: currentUser
          });
        }
      })
    );
  }

  async signup(data: UserRegister): Promise<UserResponse> {
    return await firstValueFrom(
      this.http.post<UserResponse>(`${this.apiUrl}/register`, data, { withCredentials: true })
    );
  }

  clearSession(): void {
    this.sessionSignal.set(null);
    this.storage.remove(AUTH_STORAGE_KEY);
  }

  private persistSession(session: AuthSession) {
    this.sessionSignal.set(session);
    this.storage.write(AUTH_STORAGE_KEY, session);
  }

  private restoreSession(): AuthSession | null {
    const stored = this.storage.read<AuthSession>(AUTH_STORAGE_KEY);
    if (!stored) {
      return null;
    }

    if (
      stored?.accessToken &&
      stored?.user?.id &&
      stored?.user?.email &&
      VALID_ROLES.includes(stored.user.role)
    ) {
      return stored;
    }

    this.storage.remove(AUTH_STORAGE_KEY);
    return null;
  }

}
