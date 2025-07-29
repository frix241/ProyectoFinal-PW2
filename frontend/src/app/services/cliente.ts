import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ClienteService {
  private apiUrl = "https://report-api-7eey.onrender.com/api/";

  constructor(private http: HttpClient) {}

  // Ver todos los restaurantes
  getRestaurantes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}restaurantes/`);
  }

  // Ver detalle de un restaurante
  getRestauranteDetalle(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}restaurantes/${id}/`);
  }

  // Ver menús de un restaurante
  getMenusByRestaurante(restauranteId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}restaurante/${restauranteId}/menus/`,
    );
  }

  // Ver menú del día de un restaurante
  getMenuHoy(restauranteId: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}restaurante/${restauranteId}/menu-hoy/`,
    );
  }

  // Ver entradas de un menú
  getEntradas(menuId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}entradas/?menu_id=${menuId}`);
  }

  // Ver segundos de un menú
  getSegundos(menuId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}segundos/?menu_id=${menuId}`);
  }

  // Realizar un pedido
  crearPedido(data: {
    menu: number;
    entrada: number;
    segundo: number;
  }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}pedidos/`, data);
  }

  // Ver mis pedidos actuales (pendientes, aceptados, rechazados)
  getMisPedidos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}mis-pedidos/`);
  }

  // Ver detalle de un pedido (opcional, si tienes endpoint)
  getPedidoDetalle(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}pedidos/${id}/`);
  }

  // Actualizar estado del pedido (si el cliente puede cancelar, etc.)
  actualizarEstadoPedido(id: number, estado: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}pedidos/${id}/estado/`, {
      estado,
    });
  }

  // Mostrar detalle de un menú específico
  getMenuDetalle(menuId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}menus/${menuId}/`);
  }
}
