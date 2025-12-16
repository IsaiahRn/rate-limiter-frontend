import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RateLimiterState } from './rate-limiter.models';

export const selectRateLimiterState =
  createFeatureSelector<RateLimiterState>('rateLimiter');

export const selectClientPolicies = createSelector(
  selectRateLimiterState,
  (state) => state.clientPolicies
);

export const selectLoading = createSelector(
  selectRateLimiterState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectRateLimiterState,
  (state) => state.error
);

export const selectLastDecision = createSelector(
  selectRateLimiterState,
  (state) => state.lastDecision
);
