import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../../services/cliente';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-menu-restaurante',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu-restaurante.html',
  styleUrl: './menu-restaurante.css'
})
export class MenuRestaurante implements OnInit {
  restauranteId!: number;
  restaurante: any = null;
  menuDelDia: any = null;
  entradas: any[] = [];
  segundos: any[] = [];

  // Solo un seleccionado de cada tipo
  entradaSeleccionadaId: number | null = null;
  segundoSeleccionadoId: number | null = null;

  // Panel de pedido
  pedidoPlatos: any[] = [];
  totalPedido: number = 0;

  constructor(
    private route: ActivatedRoute,
    private clienteService: ClienteService,
    private auth: Auth,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.auth.getToken()) {
      this.router.navigate(['/login']);
      return;
    }
    this.restauranteId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarRestaurante();
  }

  cargarRestaurante() {
    this.clienteService.getRestauranteDetalle(this.restauranteId).subscribe({
      next: (restaurante) => {
        this.restaurante = restaurante;
        this.cargarMenuDelDia();
      },
      error: () => {
        this.router.navigate(['/clientes/explorador-restaurantes']);
      }
    });
  }

  cargarMenuDelDia() {
    this.clienteService.getMenuHoy(this.restauranteId).subscribe({
      next: (menu) => {
        this.menuDelDia = menu;
        this.cargarPlatos(menu.id);
      },
      error: () => {
        this.menuDelDia = null;
      }
    });
  }

  cargarPlatos(menuId: number) {
    this.clienteService.getEntradas(menuId).subscribe(entradas => this.entradas = entradas);
    this.clienteService.getSegundos(menuId).subscribe(segundos => this.segundos = segundos);
  }

  // Selección de platos (solo uno de cada tipo)
  seleccionarEntrada(entrada: any) {
    if (this.entradaSeleccionadaId === entrada.id) {
      this.entradaSeleccionadaId = null; // deseleccionar
    } else {
      this.entradaSeleccionadaId = entrada.id;
    }
    this.actualizarPanelPedido();
  }

  seleccionarSegundo(segundo: any) {
    if (this.segundoSeleccionadoId === segundo.id) {
      this.segundoSeleccionadoId = null; // deseleccionar
    } else {
      this.segundoSeleccionadoId = segundo.id;
    }
    this.actualizarPanelPedido();
  }

  actualizarPanelPedido() {
    this.pedidoPlatos = [];
    this.totalPedido = 0;

    if (this.entradaSeleccionadaId) {
      const entrada = this.entradas.find(e => e.id === this.entradaSeleccionadaId);
      if (entrada) {
        this.pedidoPlatos.push({ ...entrada, cantidad: 1, tipo: 'entrada' });
        this.totalPedido += Number(entrada.precio);
      }
    }
    if (this.segundoSeleccionadoId) {
      const segundo = this.segundos.find(s => s.id === this.segundoSeleccionadoId);
      if (segundo) {
        this.pedidoPlatos.push({ ...segundo, cantidad: 1, tipo: 'segundo' });
        this.totalPedido += Number(segundo.precio);
      }
    }
  }

  trackByTipo(index: number, item: any) {
    return item.tipo;
  }

  realizarPedido() {
    if (this.pedidoPlatos.length === 0) return;

    if (!this.entradaSeleccionadaId || !this.segundoSeleccionadoId) {
      alert('Debes seleccionar una entrada y un segundo.');
      return;
    }

    const data = {
      menu: this.menuDelDia.id,
      entrada: this.entradaSeleccionadaId,
      segundo: this.segundoSeleccionadoId
    };

  this.clienteService.crearPedido(data).subscribe({
    next: (pedido) => {
      this.router.navigate(['/clientes/confirmacion-pedido', pedido.id]);
    },
    error: () => {
      alert('Error al realizar el pedido.');
    }
  });
  }
}