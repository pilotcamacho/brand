import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { getCurrentUser } from '@aws-amplify/auth';

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);

  try {
    console.log('Checking authentication');
    await getCurrentUser();
    return true; // User is logged in
  } catch (error) {
    console.error('Error checking authentication:', error);
    router.navigate(['/authentication']);
    return false; // User not logged in
  }
};
