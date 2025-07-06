import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cliente',
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente.html',
  styleUrl: './cliente.css'
})
export class Cliente implements OnInit {
  restaurantes: any[] = [];
  busqueda: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>('http://127.0.0.1:8000/api/restaurantes/')
      .subscribe(data => {
        this.restaurantes = data;
      });
  }

  get restaurantesFiltrados() {
    return this.restaurantes.filter(r =>
      r.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
    );
  }

  verPedidos() {
    // TODO: Implementar vista de pedidos
    alert('Funcionalidad de pedidos próximamente');
  }

  verRestaurante(id: number) {
    // TODO: Implementar vista de restaurante individual
    alert(`Ver restaurante ID: ${id}`);
  }
}
