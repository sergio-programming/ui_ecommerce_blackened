import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthServices } from '../services/auth-services';

export const adminGuard: CanActivateFn = () => {

  const authServices = inject(AuthServices);
  const router = inject(Router);
  const currentUser = authServices.getCurrentUser();

  if (!authServices.isLoggedIn() || !currentUser) {
    return router.createUrlTree(['/auth/login']);
  }

  if (currentUser.role === 'staff') {
    return router.createUrlTree(['/staff/dashboard']);
  }

  if (currentUser.role === 'user') {
    return router.createUrlTree(['/user/mi-cuenta']);
  }

  return currentUser.role === 'admin' ? true : router.createUrlTree(['/auth/login']);
};
