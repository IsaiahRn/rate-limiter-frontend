import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ClientPolicy } from '../../state/rate-limiter.models';
import { environment } from '../../../environments/environment';

type UserSummaryDto = { username: string };

@Injectable({ providedIn: 'root' })
export class RateLimiterApiService {
  private http = inject(HttpClient);

  private readonly base = environment.apiBaseUrl.replace(/\/+$/, '');

  // ADMIN
  getClientUsers(): Observable<string[]> {
    return this.http
      .get<UserSummaryDto[]>(`${this.base}/admin/users/clients`)
      .pipe(map((rows) => (rows ?? []).map((r) => r.username)));
  }

  // ADMIN
  getClientPolicies(): Observable<ClientPolicy[]> {
    return this.http.get<ClientPolicy[]>(`${this.base}/rate-limits/clients`);
  }

  // ADMIN
  upsertClientPolicy(policy: ClientPolicy): Observable<ClientPolicy> {
    return this.http.post<ClientPolicy>(`${this.base}/rate-limits/clients`, policy);
  }

  // ADMIN
  deleteClientPolicy(clientId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/rate-limits/clients/${encodeURIComponent(clientId)}`);
  }

  // CLIENT/ADMIN
  demoNotify(): Observable<string> {
    return this.http.post(`${this.base}/demo/notify`, {}, { responseType: 'text' });
  }
}
