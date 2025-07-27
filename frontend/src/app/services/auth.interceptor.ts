import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { Auth } from './auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Excluir el endpoint de registro de usuario
  if (req.url.endsWith('/auth/users/')) {
    return next(req);
  }

  const auth = inject(Auth);
  const token = auth.getToken();
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return next(req);
};