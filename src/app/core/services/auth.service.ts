import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export type UserRole = 'ADMIN' | 'CLIENT';

export type AuthState = {
  username: string | null;
  role: UserRole | null;
  token: string | null;
};

type LoginRequest = { username: string; password: string };
type LoginResponse = { username: string; role: UserRole; token: string };

const STORAGE_KEY = 'rl_auth_v1';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly state$ = new BehaviorSubject<AuthState>(this.loadFromStorage());
  readonly authState$ = this.state$.asObservable();

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    const url = `${environment.apiBaseUrl}/auth/login`;
    return this.http.post<LoginResponse>(url, { username, password } satisfies LoginRequest).pipe(
      tap((res) => {
        const next: AuthState = { username: res.username, role: res.role, token: res.token };
        this.state$.next(next);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      })
    );
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.state$.next({ username: null, role: null, token: null });
  }

  get token(): string | null {
    return this.state$.value.token;
  }

  get role(): UserRole | null {
    return this.state$.value.role;
  }

  get username(): string | null {
    return this.state$.value.username;
  }

  get isAuthenticated(): boolean {
    return !!this.state$.value.token;
  }

  private loadFromStorage(): AuthState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { username: null, role: null, token: null };
      const parsed = JSON.parse(raw) as AuthState;
      if (!parsed || typeof parsed !== 'object') return { username: null, role: null, token: null };
      return {
        username: parsed.username ?? null,
        role: (parsed.role as UserRole) ?? null,
        token: parsed.token ?? null
      };
    } catch {
      return { username: null, role: null, token: null };
    }
  }
}
