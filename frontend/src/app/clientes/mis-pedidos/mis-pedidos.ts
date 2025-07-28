import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService } from '../../services/cliente';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mis-pedidos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-pedidos.html',
  styleUrl: './mis-pedidos.css'
})
export class MisPedidos implements OnInit {
  pedidos: any[] = [];
  cargando = true;

  constructor(
    private clienteService: ClienteService,
    private auth: Auth,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.auth.getToken()) {
      this.router.navigate(['/login']);
      return;
    }
    this.cargarMisPedidos();
  }

  cargarMisPedidos() {
    this.cargando = true;
    this.clienteService.getMisPedidos().subscribe({
      next: (pedidos) => {
        this.pedidos = pedidos;
        this.cargando = false;
      },
      error: () => {
        this.pedidos = [];
        this.cargando = false;
      }
    });
  }

  getTotalPedido(pedido: any): number {
    const entrada = Number(pedido.entrada?.precio) || 0;
    const segundo = Number(pedido.segundo?.precio) || 0;
    return entrada + segundo;
  }

  irAMenuRestaurante() {
    this.router.navigate(['/clientes/explorador-restaurantes']);
  }
}