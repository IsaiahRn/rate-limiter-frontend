import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { RateLimiterApiService } from '../../core/services/rate-limiter-api.service';
import { ClientPolicy, ThrottleMode } from '../../state/rate-limiter.models';

@Component({
  selector: 'app-policies',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './policies.component.html',
  styleUrls: ['./policies.component.scss']
})
export class PoliciesComponent {
  private fb = inject(FormBuilder);
  private api = inject(RateLimiterApiService);

  loading = false;
  error: string | null = null;

  policies: ClientPolicy[] = [];
  clientUsers: string[] = [];

  selectedClientId: string | null = null;

  form = this.fb.nonNullable.group({
    clientId: ['', [Validators.required, Validators.minLength(2)]],
    windowSeconds: [60, [Validators.required, Validators.min(1)]],
    windowMaxRequests: [5, [Validators.required, Validators.min(1)]],
    monthlyMaxRequests: [100, [Validators.required, Validators.min(1)]],
    throttleMode: ['HARD' as ThrottleMode, [Validators.required]]
  });

  constructor() {
    this.refresh();
    this.loadClientUsers();
  }

  private loadClientUsers(): void {
    this.api.getClientUsers().subscribe({
      next: (users) => (this.clientUsers = users ?? []),
      error: () => (this.clientUsers = [])
    });
  }

  refresh(): void {
    this.loading = true;
    this.error = null;

    this.api.getClientPolicies().subscribe({
      next: (policies) => {
        this.loading = false;
        this.policies = policies ?? [];
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || err?.message || 'Failed to load policies';
      }
    });
  }

  select(p: ClientPolicy): void {
    this.selectedClientId = p.clientId;

    this.form.patchValue({
      clientId: p.clientId,
      windowSeconds: p.windowSeconds,
      windowMaxRequests: p.windowMaxRequests,
      monthlyMaxRequests: p.monthlyMaxRequests,
      throttleMode: p.throttleMode
    });
  }

  clear(): void {
    this.selectedClientId = null;
    this.error = null;

    this.form.reset({
      clientId: '',
      windowSeconds: 60,
      windowMaxRequests: 5,
      monthlyMaxRequests: 100,
      throttleMode: 'HARD'
    });
  }

  save(): void {
    if (this.loading || this.form.invalid) return;

    this.loading = true;
    this.error = null;

    const payload: ClientPolicy = this.form.getRawValue();

    this.api.upsertClientPolicy(payload).subscribe({
      next: (saved) => {
        this.loading = false;

        const idx = this.policies.findIndex((x) => x.clientId === saved.clientId);
        if (idx >= 0) this.policies[idx] = saved;
        else this.policies = [saved, ...this.policies];

        this.select(saved);
      },
      error: (err) => {
        this.loading = false;

        const ve = err?.error?.validationErrors;
        if (ve && typeof ve === 'object') {
          const first = Object.keys(ve)[0];
          this.error = ve[first];
          return;
        }

        this.error = err?.error?.message || err?.message || 'Failed to save policy';
      }
    });
  }

  remove(clientId: string): void {
    if (this.loading) return;

    this.loading = true;
    this.error = null;

    this.api.deleteClientPolicy(clientId).subscribe({
      next: () => {
        this.loading = false;
        this.policies = this.policies.filter((p) => p.clientId !== clientId);
        if (this.selectedClientId === clientId) this.clear();
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || err?.message || 'Failed to delete policy';
      }
    });
  }
}
