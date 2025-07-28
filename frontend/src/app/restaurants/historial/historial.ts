import { Component, OnInit } from '@angular/core';
import { RestaurantService, Restaurant } from '../../services/restaurant';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial.html',
  styleUrl: './historial.css'
})
export class Historial implements OnInit {
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
        this.cargarHistorial();
      });
    });
  }

  get imagenRestauranteUrl(): string {
    if (!this.restauranteImagen) return 'restoLogo.svg';
    if (this.restauranteImagen.startsWith('http')) return this.restauranteImagen;
    return `http://localhost:8000${this.restauranteImagen}`;
  }

  cargarHistorial() {
    this.cargando = true;
    this.restaurantService.getPedidosHistorialRestaurante(this.restauranteId).subscribe(pedidos => {
      // Solo pedidos aceptados o rechazados
      this.pedidos = pedidos.filter(p => p.estado === 'aceptado' || p.estado === 'rechazado');
      this.cargando = false;
    });
  }

  getTotalPedido(pedido: any): number {
    const entrada = Number(pedido.entrada?.precio) || 0;
    const segundo = Number(pedido.segundo?.precio) || 0;
    return entrada + segundo;
  }

  irAMenuDia() {
    window.location.href = '/restaurants/menu-dia';
  }

  irAPedidosDia() {
    window.location.href = '/restaurants/pedidos-dia';
  }

  irAHistorial() {
    window.location.href = '/restaurants/historial';
  }

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  async imprimirRecibo(pedido: any) {
    const jsPDFModule = await import('jspdf');
    const doc = new jsPDFModule.jsPDF();
    doc.text(`Recibo de Pedido #${pedido.id}`, 10, 10);
    doc.text(`Restaurante: ${this.restauranteNombre}`, 10, 20);
    doc.text(`Cliente: ${pedido.cliente_nombre || pedido.cliente}`, 10, 30);
    doc.text(`Entrada: ${pedido.entrada?.nombre || 'Sin entrada'}`, 10, 40);
    doc.text(`Segundo: ${pedido.segundo?.nombre || 'Sin segundo'}`, 10, 50);
    doc.text(`Total: S/ ${(Number(pedido.entrada?.precio) || 0) + (Number(pedido.segundo?.precio) || 0)}`, 10, 60);
    doc.text(`Estado: ${pedido.estado}`, 10, 70);
    doc.save(`recibo_pedido_${pedido.id}.pdf`);
  }
}