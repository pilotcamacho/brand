import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { createHash } from 'crypto';

export const authGuard: CanActivateFn = async (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);

  const email = route.paramMap.get('email');
  const hash = route.paramMap.get('hash');

  console.log('authGuard::email|hash: ', email, hash);

  const hasE = await hashEmail(email ?? '')
  console.log('authGuard::hasE: ', hasE);
  
  return isValidEmail(email) && hash ===hasE;
};

function isValidEmail(email: string | null): boolean {
  if (email === null) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function hashEmail(email: string): Promise<string> {
  const normalized = email.toLowerCase().trim();
  const encoder = new TextEncoder();
  const data = encoder.encode(normalized);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}




// try {
//   console.log('Checking authentication');
//   await getCurrentUser();
//   return true; // User is logged in
// } catch (error) {
//   console.error('Error checking authentication:', error);
//   router.navigate(['/authentication']);
//   return false; // User not logged in
// }