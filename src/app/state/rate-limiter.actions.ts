import { createAction, props } from '@ngrx/store';
import {
  ClientPolicy,
  RateLimitDecision
} from './rate-limiter.models';

// Load all policies
export const loadClientPolicies = createAction(
  '[RateLimiter] Load Client Policies'
);

export const loadClientPoliciesSuccess = createAction(
  '[RateLimiter] Load Client Policies Success',
  props<{ policies: ClientPolicy[] }>()
);

export const loadClientPoliciesFailure = createAction(
  '[RateLimiter] Load Client Policies Failure',
  props<{ error: string }>()
);

// Save / upsert policy
export const saveClientPolicy = createAction(
  '[RateLimiter] Save Client Policy',
  props<{ policy: ClientPolicy }>()
);

export const saveClientPolicySuccess = createAction(
  '[RateLimiter] Save Client Policy Success',
  props<{ policy: ClientPolicy }>()
);

export const saveClientPolicyFailure = createAction(
  '[RateLimiter] Save Client Policy Failure',
  props<{ error: string }>()
);

// Delete (deactivate) policy
export const deleteClientPolicy = createAction(
  '[RateLimiter] Delete Client Policy',
  props<{ clientId: string }>()
);

export const deleteClientPolicySuccess = createAction(
  '[RateLimiter] Delete Client Policy Success',
  props<{ clientId: string }>()
);

export const deleteClientPolicyFailure = createAction(
  '[RateLimiter] Delete Client Policy Failure',
  props<{ error: string }>()
);

// Simulator: check allowance
export const checkAllowance = createAction(
  '[RateLimiter] Check Allowance',
  props<{ clientId: string }>()
);

export const checkAllowanceSuccess = createAction(
  '[RateLimiter] Check Allowance Success',
  props<{ decision: RateLimitDecision }>()
);

export const checkAllowanceFailure = createAction(
  '[RateLimiter] Check Allowance Failure',
  props<{ error: string }>()
);
