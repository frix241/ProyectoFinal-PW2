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
        // Opcional: guardar en localStorage solo si se necesita en otros componentes
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
    this.auth.getCurrentUser().subscribe(user => {
      this.restaurantService.getRestaurantePorUsuario(user.id).subscribe(restaurante => {
        this.restaurantService.getMenuHoy(restaurante.id).subscribe(menu => {
          this.menus = [menu];
          this.seleccionarMenu(menu);
        });
      });
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

    const formData = new FormData();
    formData.append('nombre', this.nuevoEntrada.nombre || '');
    formData.append('cantidad', String(this.nuevoEntrada.cantidad || 0));
    formData.append('precio', String(this.nuevoEntrada.precio || 0));
    formData.append('menu', String(this.nuevoEntrada.menu || ''));
    if (this.entradaFile) {
      formData.append('imagen', this.entradaFile);
    }

    this.restaurantService.addEntrada(formData).subscribe(() => {
      this.nuevoEntrada = { nombre: '', cantidad: 1, precio: 0, imagen: '', menu: this.menuSeleccionado.id };
      this.entradaFile = null;
      this.cargarEntradas(this.menuSeleccionado.id);
      if (this.fileInputEntrada) this.fileInputEntrada.nativeElement.value = '';
    });
  }

  editarEntradaFn(entrada: Plato) {
    this.editandoEntrada = { ...entrada };
    this.nuevoEntrada = { ...entrada };
  }

  guardarEdicionEntrada() {
    if (!this.editandoEntrada) return;

    // Si hay nueva imagen, usa FormData, si no, envía objeto plano
    if (this.entradaFile) {
      const formData = new FormData();
      formData.append('nombre', this.nuevoEntrada.nombre || '');
      formData.append('cantidad', String(this.nuevoEntrada.cantidad || 0));
      formData.append('precio', String(this.nuevoEntrada.precio || 0));
      formData.append('menu', String(this.nuevoEntrada.menu || ''));
      formData.append('imagen', this.entradaFile);

      this.restaurantService.updateEntrada(this.editandoEntrada.id, formData).subscribe(() => {
        this.editandoEntrada = null;
        this.nuevoEntrada = { nombre: '', cantidad: 1, precio: 0, imagen: '', menu: this.menuSeleccionado.id };
        this.cargarEntradas(this.menuSeleccionado.id);
        if (this.fileInputEntrada) this.fileInputEntrada.nativeElement.value = '';
        this.entradaFile = null;
      });
    } else {
      // No hay nueva imagen, envía objeto plano (sin campo imagen)
      const { imagen, ...rest } = this.nuevoEntrada;
      this.restaurantService.updateEntrada(this.editandoEntrada.id, rest).subscribe(() => {
        this.editandoEntrada = null;
        this.nuevoEntrada = { nombre: '', cantidad: 1, precio: 0, imagen: '', menu: this.menuSeleccionado.id };
        this.cargarEntradas(this.menuSeleccionado.id);
        if (this.fileInputEntrada) this.fileInputEntrada.nativeElement.value = '';
      });
    }
  }

  cancelarEdicionEntrada() {
    this.editandoEntrada = null;
    this.nuevoEntrada = { nombre: '', cantidad: 1, precio: 0, imagen: '', menu: this.menuSeleccionado.id };
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

    const formData = new FormData();
    formData.append('nombre', this.nuevoSegundo.nombre || '');
    formData.append('cantidad', String(this.nuevoSegundo.cantidad || 0));
    formData.append('precio', String(this.nuevoSegundo.precio || 0));
    formData.append('menu', String(this.nuevoSegundo.menu || ''));
    if (this.segundoFile) {
      formData.append('imagen', this.segundoFile);
    }

    this.restaurantService.addSegundo(formData).subscribe(() => {
      this.nuevoSegundo = { nombre: '', cantidad: 1, precio: 0, imagen: '', menu: this.menuSeleccionado.id };
      this.segundoFile = null;
      this.cargarSegundos(this.menuSeleccionado.id);
      if (this.fileInputSegundo) this.fileInputSegundo.nativeElement.value = '';
    });
  }

  editarSegundoFn(segundo: Plato) {
    this.editandoSegundo = { ...segundo };
    this.nuevoSegundo = { ...segundo };
  }

  guardarEdicionSegundo() {
    if (!this.editandoSegundo) return;
    this.restaurantService.updateSegundo(this.editandoSegundo.id, this.nuevoSegundo).subscribe(() => {
      this.editandoSegundo = null;
      this.nuevoSegundo = { nombre: '', cantidad: 1, precio: 0, imagen: '', menu: this.menuSeleccionado.id };
      this.cargarSegundos(this.menuSeleccionado.id);
      if (this.fileInputSegundo) this.fileInputSegundo.nativeElement.value = '';
    });
  }

  cancelarEdicionSegundo() {
    this.editandoSegundo = null;
    this.nuevoSegundo = { nombre: '', cantidad: 1, precio: 0, imagen: '', menu: this.menuSeleccionado.id };
    if (this.fileInputSegundo) this.fileInputSegundo.nativeElement.value = '';
  }

  eliminarSegundo(id: number) {
    if (confirm('¿Estás seguro de eliminar este segundo?')) {
      this.restaurantService.deleteSegundo(id).subscribe(() => this.cargarSegundos(this.menuSeleccionado.id));
    }
  }

  // --- Métodos para manejo de archivos de imagen ---
  entradaFile: File | null = null;

  onFileEntradaSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.entradaFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => this.nuevoEntrada.imagen = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  eliminarImagenEntrada() {
    this.nuevoEntrada.imagen = '';
    if (this.fileInputEntrada) this.fileInputEntrada.nativeElement.value = '';
  }

  segundoFile: File | null = null;

  onFileSegundoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.segundoFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => this.nuevoSegundo.imagen = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  eliminarImagenSegundo() {
    this.nuevoSegundo.imagen = '';
    if (this.fileInputSegundo) this.fileInputSegundo.nativeElement.value = '';
  }

  // --- Sesión ---
  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}