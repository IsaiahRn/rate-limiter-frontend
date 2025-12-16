import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RateLimiterApiService } from '../../core/services/rate-limiter-api.service';

type SimulatorResult = {
  allowed: boolean;
  reason: string;
  retryAfterSeconds?: number;
};

@Component({
  selector: 'app-simulator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.scss']
})
export class SimulatorComponent {
  private api = inject(RateLimiterApiService);

  loading = false;
  error: string | null = null;
  result: SimulatorResult | null = null;

  request(): void {
    if (this.loading) return;

    this.loading = true;
    this.error = null;
    this.result = null;

    this.api.demoNotify().subscribe({
      next: () => {
        this.loading = false;
        this.result = { allowed: true, reason: 'OK', retryAfterSeconds: 0 };
      },
      error: (err) => {
        this.loading = false;

        const retry = Number(err?.headers?.get?.('Retry-After') ?? 0) || 0;

        // If backend returns RateLimitDecision JSON on 429
        const reason =
          err?.error?.reason ||
          err?.error?.message ||
          err?.message ||
          'Request blocked';

        this.result = {
          allowed: false,
          reason,
          retryAfterSeconds: retry
        };
      }
    });
  }

  badgeTitle(): string {
    return this.result?.allowed ? 'ALLOWED' : 'BLOCKED';
  }
}
