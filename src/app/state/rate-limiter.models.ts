export type ThrottleMode = 'SOFT' | 'HARD';

export interface ClientPolicy {
  clientId: string;
  windowSeconds: number;
  windowMaxRequests: number;
  monthlyMaxRequests: number;
  throttleMode: ThrottleMode;
}

export interface RateLimitDecision {
  allowed: boolean;
  softThrottled: boolean;
  reason: string;
  retryAfterSeconds: number;
  remainingInWindow: number;
  remainingInMonth: number;
}
