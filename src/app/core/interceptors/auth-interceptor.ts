import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, Observable, shareReplay, switchMap, throwError } from 'rxjs';
import { AuthServices, RefreshAccessTokenResponse } from '../services/auth-services';

let refreshRequest$: Observable<RefreshAccessTokenResponse> | null = null;

const addAuthData = (req: HttpRequest<unknown>, token: string | null): HttpRequest<unknown> => {
  if (!token) {
    return req.clone({ withCredentials: true });
  }

  return req.clone({
    withCredentials: true,
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
};

const isAuthEndpoint = (url: string): boolean => {
  return (
    url.includes('/auth/login') ||
    url.includes('/auth/register') ||
    url.includes('/auth/refresh') ||
    url.includes('/auth/logout')
  );
};

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authServices = inject(AuthServices);
  const router = inject(Router);

  const authReq = addAuthData(req, authServices.getAccessToken());

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const shouldTryRefresh = authServices.isLoggedIn() && error.status === 401 && !isAuthEndpoint(req.url);

      if (!shouldTryRefresh) {
        return throwError(() => error);
      }

      refreshRequest$ ??= authServices.refreshAccessToken().pipe(
        shareReplay(1),
        finalize(() => {
          refreshRequest$ = null;
        })
      );

      return refreshRequest$.pipe(
        switchMap((response) => {
          const retryReq = addAuthData(req, response.accessToken);
          return next(retryReq);
        }),
        catchError((refreshError) => {
          authServices.clearSession();
          router.navigate(['/auth/login'], { replaceUrl: true });
          return throwError(() => refreshError);
        })
      );
    })
  );
};
