import { Component, OnInit } from "@angular/core";
import { Pedidos } from "../../services/pedidos";
import { CommonModule } from "@angular/common";
@Component({
  selector: "app-pedidos",
  imports: [CommonModule],
  templateUrl: "./pedidos.html",
  styleUrls: ["./pedidos.css"],
})
export class PedidosComponent implements OnInit {
  pedidos: any[] = [];

  constructor(private pedidosService: Pedidos) {}

  ngOnInit(): void {
    this.pedidosService.getPedidos().subscribe({
      next: (data) => {
        this.pedidos = data;
      },
      error: (err) => {
        console.error("Error al cargar pedidos:", err);
      },
    });
  }

  volverAtras() {
    window.history.back();
  }
}
