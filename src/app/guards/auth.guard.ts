import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  if (authService.getToken()) {
    return true;
  } else {
    notificationService.showError('You must be logged in to view this page.');
    router.navigate(['/login']);
    return false;
  }
};