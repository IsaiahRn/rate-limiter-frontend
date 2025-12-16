export interface RateLimitDecision {
  allowed: boolean;
  softThrottled: boolean;
  retryAfterSeconds: number;
  reason: string | null;
  remainingInWindow: number;
  remainingInMonth: number;
}

export interface CheckAllowanceResponse {
  clientId: string;
  decision: RateLimitDecision;
}

export interface ClientRateLimitPolicy {
  clientId: string;
  windowSeconds: number;
  windowMaxRequests: number;
  monthlyMaxRequests: number;
  throttleMode: 'HARD' | 'SOFT';
}
