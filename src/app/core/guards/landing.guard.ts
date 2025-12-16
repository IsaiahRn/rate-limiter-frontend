import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const landingGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated) return router.createUrlTree(['/login']);
  if (auth.role === 'ADMIN') return router.createUrlTree(['/policies']);
  if (auth.role === 'CLIENT') return router.createUrlTree(['/simulator']);
  return router.createUrlTree(['/login']);
};
