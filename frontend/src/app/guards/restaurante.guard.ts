import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { Observable, map, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestauranteGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {}

  canActivate(): Observable<boolean> {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return of(false);
    }

    return this.auth.getUserProfile().pipe(
      map(user => {
        if (user.tipo === 'restaurante') {
          return true;
        } else {
          this.router.navigate(['/cliente']);
          return false;
        }
      }),
      catchError(() => {
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}
