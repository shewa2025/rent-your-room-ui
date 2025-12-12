import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  console.log('JWT Interceptor: Intercepting request for', req.url);
  console.log('JWT Interceptor: Request headers before cloning', req.headers);

  if (token) {
    console.log('JWT Interceptor: Token found, attaching to request.');
    let headers = req.headers.set('Authorization', `Bearer ${token}`);

    if (req.body instanceof FormData) {
      // Let the browser set the Content-Type header for FormData
      headers = headers.delete('Content-Type');
    }

    const cloned = req.clone({ headers });
    console.log('JWT Interceptor: Request headers after cloning', cloned.headers);
    return next(cloned);
  } else {
    console.log('JWT Interceptor: No token found, passing request without token.');
  }

  return next(req);
};