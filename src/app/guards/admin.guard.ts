import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  if (authService.getToken() && !authService.isTokenExpired() && authService.getUserRole() === 'ADMIN') {
    return true;
  } else {
    if (authService.isTokenExpired()) {
      notificationService.showError('Your session has expired. Please log in again.');
      authService.logout();
    } else {
      notificationService.showError('You do not have permission to view this page.');
    }
    router.navigate(['/properties']);
    return false;
  }
};