import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
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
  standalone: true
})
export class RestaurantePanel implements OnInit {
  nombreRestaurante: string = "";
  vistaActual: string = "panel"; // panel, menu, pedidos, historial
  menuHoy: any = null;
  pedidosHoy: any[] = [];
  entradas: any[] = [];
  segundos: any[] = [];
  tabActual: 'entradas' | 'segundos' = 'entradas';
  editandoEntradaId: number | null = null;
  editandoSegundoId: number | null = null;
  entradaEditadaIndex: number | null = null;
  segundoEditadoIndex: number | null = null;

  @ViewChild('seccionEntradas') seccionEntradas!: ElementRef;
  @ViewChild('seccionSegundos') seccionSegundos!: ElementRef;
  @ViewChild('fileInputEntrada') fileInputEntrada!: ElementRef;
  @ViewChild('fileInputSegundo') fileInputSegundo!: ElementRef;

  nuevaEntrada = { nombre: "", precio: 0, cantidad: 0, imagenUrl: "" };
  nuevoSegundo = { nombre: "", precio: 0, cantidad: 0, imagenUrl: "" };

  constructor(
    private restauranteService: RestauranteService,
    private auth: Auth,
    private router: Router,
  ) {}

  ngOnInit() {
    this.cargarDatosRestaurante();
    this.cargarMenuHoy();
    this.cargarPedidos();
    this.cargarEntradas();
    this.cargarSegundos();
  }

  cargarDatosRestaurante() {
    this.auth.getUserProfile().subscribe({
      next: (user) => {
        if (user.tipo === "restaurante") {
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
    this.restauranteService.actualizarEstadoPedido(pedidoId, "aceptado").subscribe({
      next: () => {
        this.cargarPedidos();
      },
    });
  }

  rechazarPedido(pedidoId: number) {
    this.restauranteService
      .actualizarEstadoPedido(pedidoId, "rechazado")
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

  cargarEntradas() {
    this.restauranteService.getEntradas().subscribe({
      next: (entradas) => {
        this.entradas = entradas.map(entrada => ({
          ...entrada,
          imagenUrl: entrada.imagen_url || 'assets/placeholder-food.jpg'
        }));
      },
      error: (err) => {
        console.error('Error cargando entradas:', err);
      }
    });
  }

  cargarSegundos(): Promise<void> {
    return new Promise((resolve) => {
      this.restauranteService.getSegundos().subscribe({
        next: (segundos) => {
          this.segundos = segundos.map(segundo => ({
            ...segundo,
            imagenUrl: segundo.imagen_url || 'assets/placeholder-food.jpg'
          }));
          resolve();
        }
      });
    });
  }
    agregarEntrada() {
      const formData = new FormData();
      formData.append('nombre', this.nuevaEntrada.nombre);
      formData.append('precio', this.nuevaEntrada.precio.toString());
      formData.append('cantidad', this.nuevaEntrada.cantidad.toString());

      if (this.fileInputEntrada.nativeElement.files[0]) {
        formData.append('imagen', this.fileInputEntrada.nativeElement.files[0]);
      }

      this.restauranteService.crearEntrada(formData).subscribe({
        next: () => {
          this.cargarEntradas(); // Esto ahora refrescará la lista con la imagen
        }
      });
    }

    agregarSegundo() {
      const formData = new FormData();
      formData.append('nombre', this.nuevoSegundo.nombre);
      formData.append('precio', this.nuevoSegundo.precio.toString());
      formData.append('cantidad', this.nuevoSegundo.cantidad.toString());

      // Asegúrate de que el input file esté correctamente referenciado
      const fileInput = this.fileInputSegundo.nativeElement;
      if (fileInput.files && fileInput.files[0]) {
        formData.append('imagen', fileInput.files[0], fileInput.files[0].name); // Agrega el nombre del archivo
      }

      this.restauranteService.crearSegundo(formData).subscribe({
        next: (response) => {
          console.log('Segundo creado:', response); // Verifica la respuesta
          this.cargarSegundos();
          this.resetFormularioSegundo();
          this.fileInputSegundo.nativeElement.value = '';
        },
        error: (err) => {
          console.error('Error completo:', err); // Muestra el error completo
          if (err.error) {
            console.error('Detalles del error:', err.error);
          }
        }
      });
    }

  resetFormularioEntrada() {
    this.nuevaEntrada = { nombre: "", precio: 0, cantidad: 0, imagenUrl: "" };
    this.fileInputEntrada.nativeElement.value = '';
    this.editandoEntradaId = null;
  }

  resetFormularioSegundo() {
    this.nuevoSegundo = { nombre: "", precio: 0, cantidad: 0, imagenUrl: "" };
    this.fileInputSegundo.nativeElement.value = '';
    this.editandoSegundoId = null;
  }

  editarEntrada(entrada: any, index: number) {
    this.editandoEntradaId = entrada.id;
    this.entradaEditadaIndex = index;
    this.nuevaEntrada = { ...entrada };
    setTimeout(() => {
      this.seccionEntradas.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  editarSegundo(segundo: any, index: number) {
    this.editandoSegundoId = segundo.id;
    this.segundoEditadoIndex = index;
    this.nuevoSegundo = { ...segundo };
    setTimeout(() => {
      this.seccionSegundos.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }
}
