// @ts-nocheck

import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { SimulatorComponent } from './simulator.component';
import { RateLimiterApiService } from '../../core/services/rate-limiter-api.service';

function asAnyExpect() {
  return (expect as unknown) as any;
}

describe('SimulatorComponent', () => {
  it('creates', async () => {
    const mockApi: Partial<RateLimiterApiService> = {
      demoNotify: () => of('Notification accepted')
    };

    await TestBed.configureTestingModule({
      imports: [SimulatorComponent],
      providers: [{ provide: RateLimiterApiService, useValue: mockApi }]
    }).compileComponents();

    const fixture = TestBed.createComponent(SimulatorComponent);
    fixture.detectChanges();

    asAnyExpect()(fixture.componentInstance).toBeTruthy();
  });

  it('request() sets ALLOWED on success', async () => {
    const mockApi: Partial<RateLimiterApiService> = {
      demoNotify: () => of('Notification accepted')
    };

    await TestBed.configureTestingModule({
      imports: [SimulatorComponent],
      providers: [{ provide: RateLimiterApiService, useValue: mockApi }]
    }).compileComponents();

    const fixture = TestBed.createComponent(SimulatorComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;

    component.request();

    asAnyExpect()(component.result?.allowed).toBe(true);
    asAnyExpect()(component.badgeTitle()).toBe('ALLOWED');
  });

  it('request() sets BLOCKED on error and reads Retry-After', async () => {
    const mockApi: Partial<RateLimiterApiService> = {
      demoNotify: () =>
        throwError(() => ({
          headers: { get: (k: string) => (k === 'Retry-After' ? '2' : null) },
          error: { reason: 'WINDOW_QUOTA_EXCEEDED' },
          message: 'Too Many Requests'
        }))
    };

    await TestBed.configureTestingModule({
      imports: [SimulatorComponent],
      providers: [{ provide: RateLimiterApiService, useValue: mockApi }]
    }).compileComponents();

    const fixture = TestBed.createComponent(SimulatorComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;

    component.request();

    asAnyExpect()(component.result?.allowed).toBe(false);
    asAnyExpect()(component.result?.retryAfterSeconds).toBe(2);
    asAnyExpect()(component.badgeTitle()).toBe('BLOCKED');
  });
});
