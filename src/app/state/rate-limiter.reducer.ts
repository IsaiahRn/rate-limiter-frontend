import { createReducer, on } from '@ngrx/store';
import { RateLimiterState } from './rate-limiter.models';
import * as RateLimiterActions from './rate-limiter.actions';

export const initialState: RateLimiterState = {
  clientPolicies: [],
  loading: false,
  error: null,
  lastDecision: null
};

export const rateLimiterReducer = createReducer(
  initialState,

  // Load all policies
  on(RateLimiterActions.loadClientPolicies, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(RateLimiterActions.loadClientPoliciesSuccess, (state, { policies }) => ({
    ...state,
    loading: false,
    clientPolicies: policies
  })),
  on(RateLimiterActions.loadClientPoliciesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Save / upsert
  on(RateLimiterActions.saveClientPolicy, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(RateLimiterActions.saveClientPolicySuccess, (state, { policy }) => {
    const existingIndex = state.clientPolicies.findIndex(
      (p) => p.clientId === policy.clientId
    );

    let updatedPolicies = [...state.clientPolicies];
    if (existingIndex >= 0) {
      updatedPolicies[existingIndex] = policy;
    } else {
      updatedPolicies = [...updatedPolicies, policy];
    }

    return {
      ...state,
      loading: false,
      clientPolicies: updatedPolicies
    };
  }),
  on(RateLimiterActions.saveClientPolicyFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Delete
  on(RateLimiterActions.deleteClientPolicy, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(RateLimiterActions.deleteClientPolicySuccess, (state, { clientId }) => ({
    ...state,
    loading: false,
    clientPolicies: state.clientPolicies.filter(
      (p) => p.clientId !== clientId
    )
  })),
  on(RateLimiterActions.deleteClientPolicyFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Simulator / check allowance
  on(RateLimiterActions.checkAllowance, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(RateLimiterActions.checkAllowanceSuccess, (state, { decision }) => ({
    ...state,
    loading: false,
    lastDecision: decision
  })),
  on(RateLimiterActions.checkAllowanceFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
