import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RestaurantService, Plato } from '../../services/restaurant';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-menu-dia',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './menu-dia.html',
  styleUrl: './menu-dia.css'
})
export class MenuDia implements OnInit {
  // --- Estado principal ---
  menus: any[] = [];
  menuSeleccionado: any = null;

  // --- Datos del restaurante ---
  restauranteNombre: string = '';
  restauranteImagen: string = '';

  // --- Listas de platos ---
  entradas: Plato[] = [];
  segundos: Plato[] = [];

  // --- Control de pestañas ---
  tabActual: 'entradas' | 'segundos' = 'entradas';

  // --- Formularios para agregar ---
  nuevoEntrada: Partial<Plato> = { nombre: '', cantidad: 1, precio: 0, imagen: '', menu: 0 };
  nuevoSegundo: Partial<Plato> = { nombre: '', cantidad: 1, precio: 0, imagen: '', menu: 0 };

  // --- Edición de platos ---
  editandoEntrada: Plato | null = null;
  editandoSegundo: Plato | null = null;

  // --- Referencias a inputs de archivos ---
  @ViewChild('fileInputEntrada') fileInputEntrada!: ElementRef;
  @ViewChild('fileInputSegundo') fileInputSegundo!: ElementRef;

  constructor(
    private restaurantService: RestaurantService,
    private auth: Auth
  ) {}

  // --- Ciclo de vida ---
  ngOnInit() {
    this.cargarRestaurante();
    this.cargarMenus();
  }

  // --- Métodos de restaurante ---
  cargarRestaurante() {
    this.auth.getCurrentUser().subscribe(user => {
      this.restaurantService.getRestaurantePorUsuario(user.id).subscribe(restaurante => {
        this.restauranteNombre = restaurante.nombre;
        this.restauranteImagen = restaurante.imagen;
        // Opcional: guardar en localStorage si lo necesitas en otros componentes
        // localStorage.setItem('restaurantId', restaurante.id.toString());
      });
    });
  }

  get imagenRestauranteUrl(): string {
    if (!this.restauranteImagen) return 'restoLogo.svg';
    if (this.restauranteImagen.startsWith('http')) return this.restauranteImagen;
    return `http://localhost:8000${this.restauranteImagen}`;
  }

  // --- Métodos de menú del día ---
  cargarMenus() {
    this.restaurantService.getMenus().subscribe(menus => {
      this.menus = menus;
      if (menus.length > 0) {
        this.seleccionarMenu(menus[0]);
      } else {
        // créalo automáticamente
        this.restaurantService.crearMenuHoy().subscribe(menu => {
          this.menus = [menu];
          this.seleccionarMenu(menu);
        });
      }
    });
  }

  seleccionarMenu(menu: any) {
    this.menuSeleccionado = menu;
    this.cargarEntradas(menu.id);
    this.cargarSegundos(menu.id);
  }

  // --- CRUD Entradas ---
  cargarEntradas(menuId: number) {
    this.restaurantService.getEntradas(menuId).subscribe(entradas => this.entradas = entradas);
  }

  agregarEntrada() {
    if (!this.nuevoEntrada.nombre || !this.menuSeleccionado) return;
    this.nuevoEntrada.menu = this.menuSeleccionado.id;
    this.restaurantService.addEntrada(this.nuevoEntrada).subscribe(() => {
      this.nuevoEntrada = { nombre: '', cantidad: 1, precio: 0, imagen: '', menu: this.menuSeleccionado.id };
      this.cargarEntradas(this.menuSeleccionado.id);
      if (this.fileInputEntrada) this.fileInputEntrada.nativeElement.value = '';
    });
  }

  editarEntradaFn(entrada: Plato) {
    this.editandoEntrada = { ...entrada };
  }

  guardarEdicionEntrada() {
    if (!this.editandoEntrada) return;
    this.restaurantService.updateEntrada(this.editandoEntrada.id, this.editandoEntrada).subscribe(() => {
      this.editandoEntrada = null;
      this.cargarEntradas(this.menuSeleccionado.id);
    });
  }

  cancelarEdicionEntrada() {
    this.editandoEntrada = null;
    if (this.fileInputEntrada) this.fileInputEntrada.nativeElement.value = '';
  }

  eliminarEntrada(id: number) {
    if (confirm('¿Estás seguro de eliminar esta entrada?')) {
      this.restaurantService.deleteEntrada(id).subscribe(() => this.cargarEntradas(this.menuSeleccionado.id));
    }
  }

  // --- CRUD Segundos ---
  cargarSegundos(menuId: number) {
    this.restaurantService.getSegundos(menuId).subscribe(segundos => this.segundos = segundos);
  }

  agregarSegundo() {
    if (!this.nuevoSegundo.nombre || !this.menuSeleccionado) return;
    this.nuevoSegundo.menu = this.menuSeleccionado.id;
    this.restaurantService.addSegundo(this.nuevoSegundo).subscribe(() => {
      this.nuevoSegundo = { nombre: '', cantidad: 1, precio: 0, imagen: '', menu: this.menuSeleccionado.id };
      this.cargarSegundos(this.menuSeleccionado.id);
      if (this.fileInputSegundo) this.fileInputSegundo.nativeElement.value = '';
    });
  }

  editarSegundoFn(segundo: Plato) {
    this.editandoSegundo = { ...segundo };
  }

  guardarEdicionSegundo() {
    if (!this.editandoSegundo) return;
    this.restaurantService.updateSegundo(this.editandoSegundo.id, this.editandoSegundo).subscribe(() => {
      this.editandoSegundo = null;
      this.cargarSegundos(this.menuSeleccionado.id);
    });
  }

  cancelarEdicionSegundo() {
    this.editandoSegundo = null;
    if (this.fileInputSegundo) this.fileInputSegundo.nativeElement.value = '';
  }

  eliminarSegundo(id: number) {
    if (confirm('¿Estás seguro de eliminar este segundo?')) {
      this.restaurantService.deleteSegundo(id).subscribe(() => this.cargarSegundos(this.menuSeleccionado.id));
    }
  }

  // --- Sesión ---
  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}