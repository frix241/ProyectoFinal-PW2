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

  cargarPedidos() {
    this.cargando = true;
    this.restaurantService.getPedidosPendientesRestaurante(this.restauranteId).subscribe(pedidos => {
      this.pedidos = pedidos;
      this.cargando = false;
    });
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

  logout() {
    this.auth.logout();
  }
}