import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// --- Interfaces ---
export interface Restaurant {
  id: number;
  nombre: string;
  imagen: string;
  user: number;
}

export interface Plato {
  id: number;
  nombre: string;
  cantidad: number;
  precio: number;
  imagen: string;
  menu: number;
}

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private apiUrl = 'http://localhost:8000/api/restaurants/';

  constructor(private http: HttpClient) {}

  // --- Restaurante ---
  getRestaurant(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}restaurantes/${id}/`);
  }

  getRestaurantePorUsuario(userId: number): Observable<Restaurant> {
    return this.http.get<Restaurant>(`${this.apiUrl}restaurantes/id/${userId}/`);
  }

  // --- Menú del Día ---
  getMenus(): Observable<any> {
    return this.http.get(this.apiUrl + 'menus/');
  }

  addMenu(data: { fecha: string }): Observable<any> {
    return this.http.post(this.apiUrl + 'menus/', data);
  }

  crearMenuHoy(): Observable<any> {
    const hoy = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
    return this.http.post<any>(this.apiUrl + 'menus/', { fecha: hoy });
  }

  // --- Entradas ---
  getEntradas(menuId: number): Observable<Plato[]> {
    return this.http.get<Plato[]>(`${this.apiUrl}entradas/?menu=${menuId}`);
  }

  addEntrada(entrada: Partial<Plato>): Observable<Plato> {
    return this.http.post<Plato>(this.apiUrl + 'entradas/', entrada);
  }

  updateEntrada(id: number, entrada: Partial<Plato>): Observable<Plato> {
    return this.http.put<Plato>(`${this.apiUrl}entradas/${id}/`, entrada);
  }

  deleteEntrada(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}entradas/${id}/`);
  }

  // --- Segundos ---
  getSegundos(menuId: number): Observable<Plato[]> {
    return this.http.get<Plato[]>(`${this.apiUrl}segundos/?menu=${menuId}`);
  }

  addSegundo(segundo: Partial<Plato>): Observable<Plato> {
    return this.http.post<Plato>(this.apiUrl + 'segundos/', segundo);
  }

  updateSegundo(id: number, segundo: Partial<Plato>): Observable<Plato> {
    return this.http.put<Plato>(`${this.apiUrl}segundos/${id}/`, segundo);
  }

  deleteSegundo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}segundos/${id}/`);
  }
}