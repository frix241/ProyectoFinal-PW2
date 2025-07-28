import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService } from '../../services/cliente';
import { Auth } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-explorador-restaurantes',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './explorador-restaurantes.html',
  styleUrl: './explorador-restaurantes.css'
})
export class ExploradorRestaurantes implements OnInit {
  restaurantes: any[] = [];
  restaurantesFiltrados: any[] = [];
  busqueda: string = '';
  nombreUsuario: string = '';

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
    this.auth.getCurrentUser().subscribe(user => {
      this.nombreUsuario = user.username;
    }, error => {
      this.auth.logout();
      this.router.navigate(['/login']);
    });
    this.cargarRestaurantes();
  }

  cargarRestaurantes() {
    this.clienteService.getRestaurantes().subscribe({
      next: (restaurantes) => {
        this.restaurantes = restaurantes;
        this.restaurantesFiltrados = restaurantes;
      },
      error: () => {
        // Si hay error de autenticación, redirige al login
        this.auth.logout();
        this.router.navigate(['/login']);
      }
    });
  }

  filtrarRestaurantes() {
    const termino = this.busqueda.trim().toLowerCase();
    this.restaurantesFiltrados = this.restaurantes.filter(r =>
      r.nombre.toLowerCase().includes(termino)
    );
  }

  irAMisPedidos() {
    this.router.navigate(['/clientes/mis-pedidos']);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  seleccionarRestaurante(restaurante: any) {
    this.router.navigate(['/clientes/menu-restaurante', restaurante.id]);
  }
}