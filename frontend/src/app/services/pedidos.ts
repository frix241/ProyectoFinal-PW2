import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Auth } from "./auth";

@Injectable({
  providedIn: "root",
})
export class PedidoService {
  private baseUrl = "http://127.0.0.1:8000/api/pedidos/";

  constructor(
    private http: HttpClient,
    private auth: Auth,
  ) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.auth.getToken()}`,
    });
  }

  getPedidos(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, { headers: this.getHeaders() });
  }
}
