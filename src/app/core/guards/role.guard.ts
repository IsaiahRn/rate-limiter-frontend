import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, UserRole } from '../services/auth.service';

export const roleGuard = (required: UserRole): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const role = auth.role;
    if (!auth.isAuthenticated) return router.createUrlTree(['/login']);

    if (role === required) return true;

    if (role === 'ADMIN') return router.createUrlTree(['/policies']);
    if (role === 'CLIENT') return router.createUrlTree(['/simulator']);

    return router.createUrlTree(['/login']);
  };
};
