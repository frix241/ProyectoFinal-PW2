import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth } from '../services/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class Login {
  username = '';
  password = '';
  error = '';

  constructor(private auth: Auth, private router: Router) {}

  login() {
    this.auth.login(this.username, this.password).subscribe({
      next: () => {
        console.log('Login exitoso, obteniendo perfil...');
        this.auth.getUserProfile().subscribe({
          next: user => {
            console.log('Usuario:', user);
            console.log('Tipo de usuario:', user.tipo);

            if (user.tipo === 'cliente') {
              console.log('Redirigiendo a /cliente');
              this.router.navigateByUrl('/cliente');
            } else if (user.tipo === 'restaurante') {
              console.log('Redirigiendo a /restaurante');
              this.router.navigateByUrl('/restaurante');
            } else {
              this.error = 'Tipo de usuario no reconocido';
            }
          },
          error: (err: any) => {
            console.error('Error obteniendo perfil:', err);
            this.error = 'Error obteniendo información del usuario';
          }
        });
      },
      error: (err: any) => {
        console.error('Error en login:', err);
        this.error = 'Credenciales incorrectas';
      }
    });
  }
}
