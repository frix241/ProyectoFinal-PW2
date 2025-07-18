import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private apiUrl = 'http://127.0.0.1:8000/api/auth/jwt/';

  constructor(private http: HttpClient, private jwt: JwtHelperService) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}create/`, { username, password }).pipe(
      tap((res: any) => {
        localStorage.setItem('access', res.access);
        localStorage.setItem('refresh', res.refresh);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('access');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.jwt.isTokenExpired(token);
  }

  logout() {
    localStorage.clear();
  }

  getUserProfile(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('access')}`
    });
    return this.http.get('http://127.0.0.1:8000/api/auth/users/me/', { headers });
  }

  register(username: string, password: string, tipo: string = 'cliente', nombreRestaurante?: string): Observable<any>{
    const payload: any = {
      username,
      password,
      tipo
    };

    if (tipo === 'restaurante' && nombreRestaurante) {
      payload.nombreRestaurante = nombreRestaurante;
    }

    return this.http.post('http://127.0.0.1:8000/api/auth/users/', payload);
  }
}
