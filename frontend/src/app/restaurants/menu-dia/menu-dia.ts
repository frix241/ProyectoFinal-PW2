import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RestaurantService, Plato } from '../../services/restaurant';
import { Auth }     from '../../services/auth';

@Component({
  selector: 'app-menu-dia',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './menu-dia.html',
  styleUrl: './menu-dia.css'
})
export class MenuDia implements OnInit {
  menus: any[] = [];
  entradas: Plato[] = [];
  segundos: Plato[] = [];
  menuSeleccionado: any = null;

  restauranteNombre: string = '';
  restauranteImagen: string = '';

  nuevoEntrada: Partial<Plato> = { nombre: '', cantidad: 1, precio: 0, imagen: '', menu: 0 };
  nuevoSegundo: Partial<Plato> = { nombre: '', cantidad: 1, precio: 0, imagen: '', menu: 0 };

  editandoEntrada: Plato | null = null;
  editandoSegundo: Plato | null = null;

  @ViewChild('fileInputEntrada') fileInputEntrada!: ElementRef;
  @ViewChild('fileInputSegundo') fileInputSegundo!: ElementRef;

  constructor(
    private restaurantService: RestaurantService,
    private auth: Auth
  ) {}

  ngOnInit() {
    this.cargarRestaurante();
    this.cargarMenus();
  }

  cargarRestaurante() {
    this.auth.getCurrentUser().subscribe(user => {
      this.restaurantService.getRestaurantePorUsuario(user.id).subscribe(restaurante => {
        this.restauranteNombre = restaurante.nombre;
        this.restauranteImagen = restaurante.imagen;
        console.log('Restaurante cargado:', restaurante);
        console.log('Nombre del restaurante:', this.restauranteNombre);
        console.log('Imagen del restaurante:', this.restauranteImagen);
      });
    });
  }

  // menu-dia.ts
  get imagenRestauranteUrl(): string {
    if (!this.restauranteImagen) return 'restoLogo.svg';
    if (this.restauranteImagen.startsWith('http')) return this.restauranteImagen;
    return `http://localhost:8000${this.restauranteImagen}`;
  }

  cargarMenus() {
    this.restaurantService.getMenus().subscribe(menus => {
      this.menus = menus;
      if (menus.length > 0) {
        this.seleccionarMenu(menus[0]);
      }
    });
  }

  seleccionarMenu(menu: any) {
    this.menuSeleccionado = menu;
    this.cargarEntradas(menu.id);
    this.cargarSegundos(menu.id);
  }

  cargarEntradas(menuId: number) {
    this.restaurantService.getEntradas(menuId).subscribe(entradas => this.entradas = entradas);
  }

  cargarSegundos(menuId: number) {
    this.restaurantService.getSegundos(menuId).subscribe(segundos => this.segundos = segundos);
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

  agregarSegundo() {
    if (!this.nuevoSegundo.nombre || !this.menuSeleccionado) return;
    this.nuevoSegundo.menu = this.menuSeleccionado.id;
    this.restaurantService.addSegundo(this.nuevoSegundo).subscribe(() => {
      this.nuevoSegundo = { nombre: '', cantidad: 1, precio: 0, imagen: '', menu: this.menuSeleccionado.id };
      this.cargarSegundos(this.menuSeleccionado.id);
      if (this.fileInputSegundo) this.fileInputSegundo.nativeElement.value = '';
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

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}