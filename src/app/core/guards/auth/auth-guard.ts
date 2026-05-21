import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth-service';


// PROTECTS PRIVATE ROUTES (Diary, Profile, etc.)
export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. If you already have the token in memory (normal browsing), proceed directly.
  if (authService.accessToken()) {
    return true;
  }

  // 2.If there is no token (Reload/F5), we give you the opportunity to retrieve it using the Cookie
  const isSessionRecovered = await authService.refreshSession();

  if (isSessionRecovered) {
    return true; // Session successfully recovered from the HttpOnly cookie!
  }

  // 3. If there is no cookie or it has already expired, go directly to the login
  return router.createUrlTree(['/login']);
};

// PROTECTS PUBLIC ROUTES (Login, Signup) - Prevents a logged-in user from returning to the Login
export const publicGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. If the token is already in memory, we send it to the Home page.
  if (authService.accessToken()) {
    return router.createUrlTree(['/']);
  }

  // 2. If there is no token (Reload on the login page), we check if there is a background session
  const isSessionRecovered = await authService.refreshSession();

  if (isSessionRecovered) {
    return router.createUrlTree(['/']); // If it turns out that he did have a session, we send him to the app
  }

  // 3. If it really is an anonymous user, we'll let them log in/sign up
  return true;
};
