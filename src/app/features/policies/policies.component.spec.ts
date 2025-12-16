// @ts-nocheck

import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { PoliciesComponent } from './policies.component';
import { RateLimiterApiService } from '../../core/services/rate-limiter-api.service';
import { ClientPolicy } from '../../state/rate-limiter.models';

function asAnyExpect() {
  return (expect as unknown) as any;
}

describe('PoliciesComponent', () => {
  it('creates and loads users + policies', async () => {
    const mockApi: Partial<RateLimiterApiService> = {
      getClientUsers: () => of(['client']),
      getClientPolicies: () =>
        of<ClientPolicy[]>([
          {
            clientId: 'client',
            windowSeconds: 60,
            windowMaxRequests: 5,
            monthlyMaxRequests: 100,
            throttleMode: 'HARD'
          }
        ])
    };

    await TestBed.configureTestingModule({
      imports: [PoliciesComponent],
      providers: [{ provide: RateLimiterApiService, useValue: mockApi }]
    }).compileComponents();

    const fixture = TestBed.createComponent(PoliciesComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;

    asAnyExpect()(component).toBeTruthy();
    asAnyExpect()(component.clientUsers.length).toBe(1);
    asAnyExpect()(component.policies.length).toBe(1);
    asAnyExpect()(component.policies[0].clientId).toBe('client');
  });

  it('save() calls API and updates policies list', async () => {
    const saved: ClientPolicy = {
      clientId: 'client',
      windowSeconds: 60,
      windowMaxRequests: 5,
      monthlyMaxRequests: 100,
      throttleMode: 'HARD'
    };

    let upsertCalls: any[] = [];

    const mockApi: Partial<RateLimiterApiService> = {
      getClientUsers: () => of(['client']),
      getClientPolicies: () => of<ClientPolicy[]>([]),
      upsertClientPolicy: (p: ClientPolicy) => {
        upsertCalls.push(p);
        return of(saved);
      }
    };

    await TestBed.configureTestingModule({
      imports: [PoliciesComponent],
      providers: [{ provide: RateLimiterApiService, useValue: mockApi }]
    }).compileComponents();

    const fixture = TestBed.createComponent(PoliciesComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;

    component.form.patchValue({
      clientId: 'client',
      windowSeconds: 60,
      windowMaxRequests: 5,
      monthlyMaxRequests: 100,
      throttleMode: 'HARD'
    });

    component.save();

    asAnyExpect()(upsertCalls.length).toBe(1);
    asAnyExpect()(component.policies.length).toBe(1);
    asAnyExpect()(component.policies[0].clientId).toBe('client');
    asAnyExpect()(component.selectedClientId).toBe('client');
  });

  it('save() shows backend validation error (validationErrors)', async () => {
    const mockApi: Partial<RateLimiterApiService> = {
      getClientUsers: () => of(['client']),
      getClientPolicies: () => of<ClientPolicy[]>([]),
      upsertClientPolicy: () =>
        throwError(() => ({
          error: {
            message: 'Validation failed',
            validationErrors: { clientId: 'Client user does not exist' }
          }
        }))
    };

    await TestBed.configureTestingModule({
      imports: [PoliciesComponent],
      providers: [{ provide: RateLimiterApiService, useValue: mockApi }]
    }).compileComponents();

    const fixture = TestBed.createComponent(PoliciesComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;

    component.form.patchValue({
      clientId: 'nope',
      windowSeconds: 60,
      windowMaxRequests: 5,
      monthlyMaxRequests: 100,
      throttleMode: 'HARD'
    });

    component.save();

    asAnyExpect()(component.error).toContain('Client user does not exist');
  });
});
