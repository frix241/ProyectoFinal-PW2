import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../../services/cliente';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmacion-pedido',
  standalone: true,
  templateUrl: './confirmacion-pedido.html',
  styleUrl: './confirmacion-pedido.css',
  imports: [CommonModule]
})
export class ConfirmacionPedido implements OnInit, OnDestroy {
  estado: 'loading' | 'aceptado' | 'rechazado' = 'loading';
  mensaje: string = 'Esperando confirmación de tu pedido...';
  pedidoId!: number;
  pollingInterval: any;

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
    this.pedidoId = Number(this.route.snapshot.paramMap.get('id'));
    this.verificarEstadoPedido();
    // Polling cada 2 segundos
    this.pollingInterval = setInterval(() => this.verificarEstadoPedido(), 2000);
  }

  verificarEstadoPedido() {
    this.clienteService.getPedidoDetalle(this.pedidoId).subscribe({
      next: pedido => {
        if (pedido.estado === 'pendiente') {
          this.estado = 'loading';
        } else if (pedido.estado === 'aceptado') {
          this.estado = 'aceptado';
          this.mensaje = '¡Pedido aceptado! Tu pedido está en camino 🍽️';
          clearInterval(this.pollingInterval);
        } else if (pedido.estado === 'rechazado') {
          this.estado = 'rechazado';
          this.mensaje = 'Pedido rechazado. Lo sentimos, tu pedido no pudo ser procesado.';
          clearInterval(this.pollingInterval);
        }
      },
      error: () => {
        this.estado = 'rechazado';
        this.mensaje = 'No se pudo consultar el estado del pedido.';
        clearInterval(this.pollingInterval);
      }
    });
  }

  ngOnDestroy() {
    if (this.pollingInterval) clearInterval(this.pollingInterval);
  }
}