import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './register.html'
})
export class RegisterComponent {
  username = '';
  password = '';
  tipo = 'cliente';
  error = '';
  success = '';

  constructor(private auth: Auth, private router: Router) {}

  onSubmit() {
    this.auth.register({
      username: this.username,
      password: this.password,
      tipo: this.tipo
    }).subscribe({
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
}