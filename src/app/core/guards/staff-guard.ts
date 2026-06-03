import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServices } from '../services/auth-services';

export const staffGuard: CanActivateFn = () => {

  const authServices = inject(AuthServices);
  const router = inject(Router);
  const currentUser = authServices.getCurrentUser();

  if (!authServices.isLoggedIn() || !currentUser) {
    return router.navigate(['/auth/login']);
  }

  if (currentUser.role === 'admin') {
    return router.navigate(['/admin/dashboard']);
  }

  if (currentUser.role === 'user') {
    return router.navigate(['/user/mi-cuenta']);
  }

  return true;
};
