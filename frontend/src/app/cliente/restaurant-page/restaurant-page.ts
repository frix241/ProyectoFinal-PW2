import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { OnInit } from "@angular/core";
import { Menu } from "../../services/menu";

@Component({
  selector: "app-restaurant-page",
  imports: [CommonModule],
  templateUrl: "./restaurant-page.html",
  styleUrl: "./restaurant-page.css",
})
export class RestaurantPage implements OnInit {
  restauranteId!: number;
  menus: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private menuService: Menu,
  ) {}

  ngOnInit(): void {
    const restauranteId = Number(this.route.snapshot.paramMap.get("id"));
    if (restauranteId) {
      this.menuService.getMenusPorRestaurante(restauranteId).subscribe({
        next: (data) => (this.menus = data),
        error: (err) => console.error("Error al obtener menús:", err),
      });
    }
  }
}
