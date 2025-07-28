import { Component, OnInit } from '@angular/core';
import { RestaurantService, Restaurant } from '../../services/restaurant';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import jsPDFInvoiceTemplate, { OutputType } from "jspdf-invoice-template";

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

  imprimirRecibo(pedido: any) {
    const props = {
      outputType: OutputType.Save,
      fileName: `recibo_pedido_${pedido.id}`,
      logo: {
        src: "https://i.imgur.com/M3F1rfd.png", 
        width: 53.33, // px
        height: 26.66, // px
      },
      business: {
        name: this.restauranteNombre,
        address: "Dirección del restaurante",
        phone: "Teléfono",
        email: "correo@restaurante.com",
        website: "www.restaurante.com",
      },
      contact: {
        label: "Cliente:",
        name: String(pedido.cliente_nombre || pedido.cliente),
      },
      invoice: {
        label: "N° Pedido",
        num: pedido.id, // Debe ser number, no string
        invDate: pedido.fecha ? (pedido.fecha + '').slice(0, 10) : '',
        headerBorder: false,
        tableBodyBorder: false,
        header: [
          { title: "Plato", style: { width: 50 } },
          { title: "Precio", style: { width: 50 } }
        ],
        table: [
          [pedido.entrada?.nombre || 'Sin entrada', String(pedido.entrada?.precio) || '-'],
          [pedido.segundo?.nombre || 'Sin segundo', String(pedido.segundo?.precio) || '-'],
          ['Total', ((Number(pedido.entrada?.precio) || 0) + (Number(pedido.segundo?.precio) || 0)).toFixed(2)]
        ],
        invTotalLabel: "Total:",
        invTotal: ((Number(pedido.entrada?.precio) || 0) + (Number(pedido.segundo?.precio) || 0)).toFixed(2),
        invGenLabel: "Estado:",
        invGen: pedido.estado ? String(pedido.estado) : '', // Asegura string válido
      },
      footer: {
        text: "Gracias por su preferencia.",
      },
    };

    jsPDFInvoiceTemplate(props);
  }
}