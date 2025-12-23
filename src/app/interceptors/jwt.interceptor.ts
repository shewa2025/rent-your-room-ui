import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { switchMap, take } from 'rxjs/operators';

export const jwtInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);

  return authService.isLoggedIn$.pipe(
    take(1), // Take only the first value
    switchMap(isLoggedIn => {
      const token = authService.getToken();
      console.log('JWT Interceptor called for URL:', req.url);
      console.log('isLoggedIn status:', isLoggedIn);
      console.log('Token from authService:', token);

      if (isLoggedIn && token) {
        console.log('Token found, cloning request with Authorization header.');
        
        let cloned: HttpRequest<any>;

        if (req.body instanceof FormData) {
          // For FormData requests, we must not set the 'Content-Type' header.
          // The browser will add it with the correct boundary.
          cloned = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`).delete('Content-Type')
          });
          console.log('Cloned multipart request headers:', cloned.headers.get('Authorization'));
        } else {
          cloned = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log('Cloned request headers:', cloned.headers.get('Authorization'));
        }
        return next(cloned);
      } else {
        console.log('No token found or not logged in, request not modified.');
        return next(req);
      }
    })
  );
};