import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  username = '';
  password = '';
  tipo = 'cliente';
  nombreRestaurante = '';
  imagenRestaurante: File | null = null;
  error = '';
  success = '';

  constructor(private auth: Auth, private router: Router) {}

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imagenRestaurante = input.files[0];
    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('username', this.username);
    formData.append('password', this.password);
    formData.append('tipo', this.tipo);

    if (this.tipo === 'restaurante') {
      formData.append('nombre_restaurante', this.nombreRestaurante);
      if (this.imagenRestaurante) {
        formData.append('imagen_restaurante', this.imagenRestaurante);
      }
    }

    this.auth.register(formData).subscribe({
      next: () => {
        this.success = 'Registro exitoso. Ahora puedes iniciar sesión.';
        this.error = '';
        // this.router.navigate(['/login']);
      },
      error: () => {
        this.error = 'Error en el registro. Intenta con otro usuario.';
        this.success = '';
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}