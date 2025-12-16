// src/app/state/rate-limiter.effects.ts

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { RateLimiterApiService } from '../core/services/rate-limiter-api.service';
import * as RateLimiterActions from './rate-limiter.actions';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { RateLimitDecision } from './rate-limiter.models';

@Injectable()
export class RateLimiterEffects {
  // API call effects
  loadClientPolicies$;
  saveClientPolicy$;
  deleteClientPolicy$;
  checkAllowance$;

  // Toast effects
  saveSuccessToast$;
  deleteSuccessToast$;
  failureToast$;

  constructor(
    private actions$: Actions,
    private api: RateLimiterApiService,
    private toastr: ToastrService
  ) {
    // Load all policies
    this.loadClientPolicies$ = createEffect(() =>
      this.actions$.pipe(
        ofType(RateLimiterActions.loadClientPolicies),
        mergeMap(() =>
          this.api.getClientPolicies().pipe(
            map((policies) =>
              RateLimiterActions.loadClientPoliciesSuccess({ policies })
            ),
            catchError((err) =>
              of(
                RateLimiterActions.loadClientPoliciesFailure({
                  error: this.extractError(err)
                })
              )
            )
          )
        )
      )
    );

    // Save / upsert policy
    this.saveClientPolicy$ = createEffect(() =>
      this.actions$.pipe(
        ofType(RateLimiterActions.saveClientPolicy),
        mergeMap(({ policy }) =>
          this.api.upsertClientPolicy(policy).pipe(
            map((saved) =>
              RateLimiterActions.saveClientPolicySuccess({ policy: saved })
            ),
            catchError((err) =>
              of(
                RateLimiterActions.saveClientPolicyFailure({
                  error: this.extractError(err)
                })
              )
            )
          )
        )
      )
    );

    // Delete (deactivate) policy
    this.deleteClientPolicy$ = createEffect(() =>
      this.actions$.pipe(
        ofType(RateLimiterActions.deleteClientPolicy),
        mergeMap(({ clientId }) =>
          this.api.deleteClientPolicy(clientId).pipe(
            map(() =>
              RateLimiterActions.deleteClientPolicySuccess({ clientId })
            ),
            catchError((err) =>
              of(
                RateLimiterActions.deleteClientPolicyFailure({
                  error: this.extractError(err)
                })
              )
            )
          )
        )
      )
    );

    // Simulator / check allowance
    this.checkAllowance$ = createEffect(() =>
      this.actions$.pipe(
        ofType(RateLimiterActions.checkAllowance),
        mergeMap(({ clientId }) =>
          this.api.checkAllowance(clientId).pipe(
            map((res: any) => {
              // Normalize whatever the API returns into a RateLimitDecision
              // API might return:
              //   { clientId, decision: { ...fields... } }
              // or directly:
              //   { allowed, softThrottled, ... }
              const decision: RateLimitDecision = (res && (res.decision ?? res)) as RateLimitDecision;

              return RateLimiterActions.checkAllowanceSuccess({ decision });
            }),
            catchError((err) =>
              of(
                RateLimiterActions.checkAllowanceFailure({
                  error: this.extractError(err)
                })
              )
            )
          )
        )
      )
    );

    // --- Toasts ---

    this.saveSuccessToast$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(RateLimiterActions.saveClientPolicySuccess),
          tap(() => {
            this.toastr.success(
              'Client policy saved successfully.',
              'Success'
            );
          })
        ),
      { dispatch: false }
    );

    this.deleteSuccessToast$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(RateLimiterActions.deleteClientPolicySuccess),
          tap(({ clientId }) => {
            this.toastr.success(
              `Policy for client "${clientId}" deleted.`,
              'Success'
            );
          })
        ),
      { dispatch: false }
    );

    this.failureToast$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(
            RateLimiterActions.loadClientPoliciesFailure,
            RateLimiterActions.saveClientPolicyFailure,
            RateLimiterActions.deleteClientPolicyFailure,
            RateLimiterActions.checkAllowanceFailure
          ),
          tap(({ error }) => {
            this.toastr.error(error || 'Something went wrong.', 'Error');
          })
        ),
      { dispatch: false }
    );
  }

  // Try to extract a user-friendly error message
  private extractError(err: any): string {
    if (err?.error) {
      const backend = err.error;
      if (backend.validationErrors && typeof backend.validationErrors === 'object') {
        const keys = Object.keys(backend.validationErrors);
        if (keys.length > 0) {
          return backend.validationErrors[keys[0]];
        }
      }
      if (backend.message && typeof backend.message === 'string') {
        return backend.message;
      }
    }

    if (typeof err?.message === 'string') {
      return err.message;
    }

    return 'Unexpected error occurred';
  }
}
