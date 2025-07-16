import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class Menu {
  private BASE_URL = "http://127.0.0.1:8000/api";

  constructor(private http: HttpClient) {}

  getMenusPorRestaurante(restauranteId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.BASE_URL}/menus/?restaurante_id=${restauranteId}`,
    );
  }
}
