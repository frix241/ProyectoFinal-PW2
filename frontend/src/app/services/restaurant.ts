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

  getMenuHoy(restauranteId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}restaurante/${restauranteId}/menu-hoy/`);
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
    return this.http.get<Plato[]>(`${this.apiUrl}entradas/?menu_id=${menuId}`);
  }

  addEntrada(formData: FormData): Observable<Plato> {
    return this.http.post<Plato>(this.apiUrl + 'entradas/', formData);
  }

  updateEntrada(id: number, data: Partial<Plato> | FormData) {
    return this.http.put(`${this.apiUrl}entradas/${id}/`, data);
  }

  deleteEntrada(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}entradas/${id}/`);
  }

  // --- Segundos ---
  getSegundos(menuId: number): Observable<Plato[]> {
    return this.http.get<Plato[]>(`${this.apiUrl}segundos/?menu_id=${menuId}`);return this.http.get<Plato[]>(`${this.apiUrl}segundos/?menu_id=${menuId}`);
  }

  addSegundo(formData: FormData): Observable<Plato> {
    return this.http.post<Plato>(this.apiUrl + 'segundos/', formData);
  }

  updateSegundo(id: number, data: Partial<Plato> | FormData) {
    return this.http.put(`${this.apiUrl}segundos/${id}/`, data);
  }

  deleteSegundo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}segundos/${id}/`);
  }
}