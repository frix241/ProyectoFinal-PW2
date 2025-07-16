import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Menu } from "../../services/menu";
import { Pedidos } from "../../services/pedidos";

@Component({
  selector: "app-restaurant-page",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./restaurant-page.html",
  styleUrl: "./restaurant-page.css",
})
export class RestaurantPage implements OnInit {
  restauranteId!: number;
  menus: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private MenuService: Menu,
    private PedidoService: Pedidos,
  ) {}

  ngOnInit(): void {
    this.restauranteId = Number(this.route.snapshot.paramMap.get("id"));
    if (this.restauranteId) {
      this.MenuService.getMenusPorRestaurante(this.restauranteId).subscribe({
        next: (data) => {
          this.menus = data.map((m: any) => ({
            ...m,
            entradaSeleccionada: null,
            segundoSeleccionado: null,
          }));
        },
        error: (err) => console.error("Error al obtener menús:", err),
      });
    }
  }

  hacerPedido(menu: any) {
    if (!menu.entradaSeleccionada || !menu.segundoSeleccionado) {
      alert("Selecciona una entrada y un segundo.");
      return;
    }

    this.PedidoService.crearPedido({
      menu: menu.id,
      entrada: menu.entradaSeleccionada,
      segundo: menu.segundoSeleccionado,
    }).subscribe({
      next: () => alert("Pedido realizado con éxito"),
      error: (err) => {
        console.error("Error al realizar pedido:", err);
        alert("Error al realizar el pedido");
      },
    });
  }
}
