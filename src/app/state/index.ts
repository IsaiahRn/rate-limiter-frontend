import { ActionReducerMap } from '@ngrx/store';
import { RateLimiterState } from './rate-limiter.models';
import { rateLimiterReducer } from './rate-limiter.reducer';

export interface AppState {
  rateLimiter: RateLimiterState;
}

export const reducers: ActionReducerMap<AppState> = {
  rateLimiter: rateLimiterReducer
};
