import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return authService.refreshToken().pipe(
          switchMap((response: any) => {
            localStorage.setItem('token', response.token);
            req = req.clone({
              setHeaders: {
                Authorization: `Bearer ${response.token}`,
              },
            });
            return next(req);
          }),
          catchError(() => {
            authService.logout();
            return throwError(() => new Error('Session expired.'));
          })
        );
      }
      return throwError(() => error);
    })
  );
};