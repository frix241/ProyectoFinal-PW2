import { Component, OnInit } from '@angular/core';
import { RestaurantService, Plato } from '../../services/restaurant';

@Component({
  selector: 'app-menu-dia',
  standalone: true,
  imports: [],
  templateUrl: './menu-dia.html',
  styleUrl: './menu-dia.css'
})
export class MenuDia implements OnInit {
  menus: any[] = [];
  entradas: Plato[] = [];
  segundos: Plato[] = [];
  menuSeleccionado: any = null;

  nuevoEntrada: Partial<Plato> = { nombre: '', cantidad: 1, precio: 0, imagen: '', menu: 0 };
  nuevoSegundo: Partial<Plato> = { nombre: '', cantidad: 1, precio: 0, imagen: '', menu: 0 };

  editandoEntrada: Plato | null = null;
  editandoSegundo: Plato | null = null;

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit() {
    this.cargarMenus();
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
    });
  }

  agregarSegundo() {
    if (!this.nuevoSegundo.nombre || !this.menuSeleccionado) return;
    this.nuevoSegundo.menu = this.menuSeleccionado.id;
    this.restaurantService.addSegundo(this.nuevoSegundo).subscribe(() => {
      this.nuevoSegundo = { nombre: '', cantidad: 1, precio: 0, imagen: '', menu: this.menuSeleccionado.id };
      this.cargarSegundos(this.menuSeleccionado.id);
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
  }

  eliminarEntrada(id: number) {
    this.restaurantService.deleteEntrada(id).subscribe(() => this.cargarEntradas(this.menuSeleccionado.id));
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
  }

  eliminarSegundo(id: number) {
    this.restaurantService.deleteSegundo(id).subscribe(() => this.cargarSegundos(this.menuSeleccionado.id));
  }
}