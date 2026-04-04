import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user-service';

export const adminGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  const user = userService.currentUser();

  if (user && user.isAdmin) {
    return true;
  }

  router.navigate(['/home']);
  return false;
};
