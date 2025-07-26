import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class Menu {
  private BASE_URL = "http://127.0.0.1:8000/api";

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem("access");
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    });
  }

  getMenusPorRestaurante(restauranteId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.BASE_URL}/menus/?restaurante_id=${restauranteId}`,
      { headers: this.getHeaders() },
    );
  }
}
