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

  // Selección del usuario
  seleccionEntradas: { [id: string]: number } = {};
  seleccionSegundos: { [id: string]: number } = {};

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

  // Selección de platos
  seleccionarEntrada(entrada: any, cantidad: number) {
    this.seleccionEntradas[entrada.id] = cantidad;
    this.actualizarPanelPedido();
  }

  seleccionarSegundo(segundo: any, cantidad: number) {
    this.seleccionSegundos[segundo.id] = cantidad;
    this.actualizarPanelPedido();
  }

  actualizarPanelPedido() {
    this.pedidoPlatos = [];
    this.totalPedido = 0;

    // Entradas seleccionadas
    for (const id in this.seleccionEntradas) {
      const cantidad = this.seleccionEntradas[id];
      if (cantidad > 0) {
        const entrada = this.entradas.find(e => e.id == +id);
        if (entrada) {
          this.pedidoPlatos.push({ ...entrada, cantidad });
          this.totalPedido += entrada.precio * cantidad;
        }
      }
    }
    // Segundos seleccionados
    for (const id in this.seleccionSegundos) {
      const cantidad = this.seleccionSegundos[id];
      if (cantidad > 0) {
        const segundo = this.segundos.find(s => s.id == +id);
        if (segundo) {
          this.pedidoPlatos.push({ ...segundo, cantidad });
          this.totalPedido += segundo.precio * cantidad;
        }
      }
    }
  }

  realizarPedido() {
    if (this.pedidoPlatos.length === 0) return;

    // Ejemplo: solo permite un plato de cada tipo (ajusta según tu lógica)
    const entradaId = Object.keys(this.seleccionEntradas).find(id => this.seleccionEntradas[id] > 0);
    const segundoId = Object.keys(this.seleccionSegundos).find(id => this.seleccionSegundos[id] > 0);

    if (!entradaId || !segundoId) {
      alert('Debes seleccionar al menos una entrada y un segundo.');
      return;
    }

    const data = {
      menu: this.menuDelDia.id,
      entrada: Number(entradaId),
      segundo: Number(segundoId)
    };

    this.clienteService.crearPedido(data).subscribe({
      next: () => {
        alert('¡Pedido realizado con éxito!');
        this.router.navigate(['/clientes/mis-pedidos']);
      },
      error: () => {
        alert('Error al realizar el pedido.');
      }
    });
  }
}