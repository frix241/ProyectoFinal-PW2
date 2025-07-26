import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from './auth';

export const clienteGuard: CanActivateFn = async (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (!auth.getToken()) {
    router.navigate(['/login']);
    return false;
  }

  const user = await auth.getCurrentUser().toPromise();
  if (user.tipo === 'cliente') {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};