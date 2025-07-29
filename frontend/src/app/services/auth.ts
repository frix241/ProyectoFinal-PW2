import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class Auth {
  private apiUrl = "https://report-api-7eey.onrender.com/api/auth/";

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}jwt/create/`, credentials);
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}users/`, data);
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}users/me/`);
  }

  saveToken(token: string) {
    localStorage.setItem("token", token);
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }

  logout() {
    localStorage.removeItem("token");
  }
}
