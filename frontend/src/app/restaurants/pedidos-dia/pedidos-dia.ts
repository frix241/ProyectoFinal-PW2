import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../../services/restaurant';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pedidos-dia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedidos-dia.html',
  styleUrl: './pedidos-dia.css'
})
export class PedidosDia implements OnInit {
  pedidos: any[] = [];
  cargando = true;
  restauranteId!: number;
  restauranteNombre: string = '';
  restauranteImagen: string = '';

  constructor(
    private restaurantService: RestaurantService,
    private auth: Auth
  ) {}

  ngOnInit() {
    this.auth.getCurrentUser().subscribe(user => {
      this.restaurantService.getRestaurantePorUsuario(user.id).subscribe(restaurante => {
        this.restauranteId = restaurante.id;
        this.restauranteNombre = restaurante.nombre;
        this.restauranteImagen = restaurante.imagen;
        this.cargarPedidos();
      });
    });
  }

  get imagenRestauranteUrl(): string {
    if (!this.restauranteImagen) return 'restoLogo.svg';
    if (this.restauranteImagen.startsWith('http')) return this.restauranteImagen;
    return `http://localhost:8000${this.restauranteImagen}`;
  }

  cargarPedidos() {
    this.cargando = true;
    this.restaurantService.getPedidosPendientesRestaurante(this.restauranteId).subscribe(pedidos => {
      // Solo nombre, imagen pequeña y total calculado
      this.pedidos = pedidos.map(p => ({
        id: p.id,
        cliente: p.cliente_nombre || p.cliente || 'Desconocido',
        entradaNombre: p.entrada?.nombre || 'Sin entrada',
        entradaImg: p.entrada?.imagen || '',
        segundoNombre: p.segundo?.nombre || 'Sin segundo',
        segundoImg: p.segundo?.imagen || '',
        total: (p.entrada?.precio || 0) + (p.segundo?.precio || 0)
      }));
      this.cargando = false;
    });
  }

  getPlatoImgUrl(imagen: string): string {
    if (!imagen) return 'assets/placeholder-food.jpg';
    if (imagen.startsWith('http')) return imagen;
    return `http://localhost:8000${imagen}`;
  }

  aceptarPedido(pedidoId: number) {
    this.restaurantService.updateEstadoPedido(pedidoId, 'aceptado').subscribe(() => {
      this.pedidos = this.pedidos.filter(p => p.id !== pedidoId);
    });
  }

  rechazarPedido(pedidoId: number) {
    this.restaurantService.updateEstadoPedido(pedidoId, 'rechazado').subscribe(() => {
      this.pedidos = this.pedidos.filter(p => p.id !== pedidoId);
    });
  }

  irAHistorial() {
    window.location.href = '/restaurants/historial';
  }

  irAMenuDia() {
    window.location.href = '/restaurants/menu-dia';
  }

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}