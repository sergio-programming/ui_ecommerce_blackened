import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServices } from '../services/auth-services';

export const staffGuard: CanActivateFn = () => {

  const authServices = inject(AuthServices);
  const router = inject(Router);
  const currentUser = authServices.getCurrentUser();

  if (!authServices.isLoggedIn() || !currentUser) {
    return router.createUrlTree(['/auth/login']);
  }

  if (currentUser.role === 'admin') {
    return router.createUrlTree(['/admin/dashboard']);
  }

  if (currentUser.role === 'user') {
    return router.createUrlTree(['/user/mi-cuenta']);
  }

  return currentUser.role === 'staff' ? true : router.createUrlTree(['/auth/login']);
};
