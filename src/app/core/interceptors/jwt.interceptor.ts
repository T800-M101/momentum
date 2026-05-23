import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth-service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.accessToken();

  const authReq = req.clone({
    withCredentials: true,          // ← sends RT cookie on every request
    setHeaders: token
      ? { Authorization: `Bearer ${token}` }
      : {},
  });

  return next(authReq);
};
