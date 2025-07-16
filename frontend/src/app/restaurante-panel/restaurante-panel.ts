import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RestauranteService } from "../services/restaurante.service";
import { Auth } from "../services/auth";
import { Router } from "@angular/router";

@Component({
  selector: "app-restaurante-panel",
  imports: [FormsModule, CommonModule],
  templateUrl: "./restaurante-panel.html",
  styleUrl: "./restaurante-panel.css",
})
export class RestaurantePanel implements OnInit {
  nombreRestaurante: string = "";
  vistaActual: string = "panel"; // panel, menu, pedidos, historial
  menuHoy: any = null;
  pedidosHoy: any[] = [];
  entradas: any[] = [];
  segundos: any[] = [];

  // Para crear menú
  nuevaEntrada = { nombre: "", precio: 0, disponible: true };
  nuevoSegundo = { nombre: "", precio: 0, disponible: true };

  constructor(
    private restauranteService: RestauranteService,
    private auth: Auth,
    private router: Router,
  ) {}

  ngOnInit() {
    this.cargarDatosRestaurante();
    this.cargarMenuHoy();
    this.cargarPedidos();
  }

  cargarDatosRestaurante() {
    this.auth.getUserProfile().subscribe({
      next: (user) => {
        if (user.tipo === "restaurante") {
          // Buscar el restaurante del usuario
          this.restauranteService.getRestaurantes().subscribe({
            next: (restaurantes) => {
              const miRestaurante = restaurantes.find(
                (r) => r.user === user.id,
              );
              if (miRestaurante) {
                this.nombreRestaurante = miRestaurante.nombre;
              }
            },
          });
        }
      },
    });
  }

  cargarMenuHoy() {
    const hoy = new Date().toISOString().split("T")[0];
    this.restauranteService.getMenus().subscribe({
      next: (menus) => {
        this.menuHoy = menus.find((m) => m.fecha === hoy);
      },
    });
  }

  cargarPedidos() {
    this.restauranteService.getPedidos().subscribe({
      next: (pedidos) => {
        const hoy = new Date().toISOString().split("T")[0];
        this.pedidosHoy = pedidos.filter((p) => p.fecha.startsWith(hoy));
      },
    });
  }

  mostrarVistaMenu() {
    this.vistaActual = "menu";
  }

  mostrarVistaPedidos() {
    this.vistaActual = "pedidos";
    this.cargarPedidos();
  }

  mostrarVistaHistorial() {
    this.vistaActual = "historial";
  }

  volverAlPanel() {
    this.vistaActual = "panel";
  }

  aceptarPedido(pedidoId: number) {
    this.restauranteService.updatePedidoEstado(pedidoId, "aceptado").subscribe({
      next: () => {
        this.cargarPedidos();
      },
    });
  }

  rechazarPedido(pedidoId: number) {
    this.restauranteService
      .updatePedidoEstado(pedidoId, "rechazado")
      .subscribe({
        next: () => {
          this.cargarPedidos();
        },
      });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(["/login"]);
  }
  irACrearMenu() {}
}
