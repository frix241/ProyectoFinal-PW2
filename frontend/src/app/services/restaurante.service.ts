import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestauranteService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('access')}`
    });
  }

  // Obtener restaurantes
  getRestaurantes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/restaurantes/`);
  }

  // Obtener restaurante por usuario
  getRestauranteByUser(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/restaurantes/`, { headers: this.getHeaders() });
  }

  // Obtener menús de un restaurante
  getMenus(restauranteId?: number): Observable<any[]> {
    const url = restauranteId 
      ? `${this.apiUrl}/menus/?restaurante_id=${restauranteId}`
      : `${this.apiUrl}/menus/`;
    return this.http.get<any[]>(url, { headers: this.getHeaders() });
  }

  // Crear menú
  createMenu(menu: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/menus/`, menu, { headers: this.getHeaders() });
  }

  // Obtener entradas
  getEntradas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/entradas/`, { headers: this.getHeaders() });
  }

  // Crear entrada
  createEntrada(entrada: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/entradas/`, entrada, { headers: this.getHeaders() });
  }

  // Obtener segundos
  getSegundos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/segundos/`, { headers: this.getHeaders() });
  }

  // Crear segundo
  createSegundo(segundo: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/segundos/`, segundo, { headers: this.getHeaders() });
  }

  // Obtener pedidos
  getPedidos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pedidos/`, { headers: this.getHeaders() });
  }

  // Actualizar estado de pedido
  updatePedidoEstado(pedidoId: number, estado: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/pedidos/${pedidoId}/`, 
      { estado }, 
      { headers: this.getHeaders() }
    );
  }
}
