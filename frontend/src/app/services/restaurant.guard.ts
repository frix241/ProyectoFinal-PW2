import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from './auth';

export const restaurantGuard: CanActivateFn = async (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (!auth.getToken()) {
    router.navigate(['/login']);
    return false;
  }

  // Obtén el usuario actual (puedes mejorar esto con un observable/cache)
  const user = await auth.getCurrentUser().toPromise();
  if (user.tipo === 'restaurante') {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};