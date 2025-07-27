import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private auth: Auth, private router: Router) {}

  onSubmit() {
    this.auth.login({ username: this.username, password: this.password }).subscribe({
      next: (res) => {
        this.auth.saveToken(res.access);
        // Ahora obtenemos el usuario autenticado
        this.auth.getCurrentUser().subscribe({
          next: (user) => {
            if (user.tipo === 'restaurante') {
              this.router.navigate(['/restaurants/menu-dia']);
            } else {
              this.router.navigate(['/clientes/explorador-restaurantes']);
            }
          }
        });
      },
      error: () => {
        this.error = 'Usuario o contraseña incorrectos';
      }
    });
  }
  goToRegister() {
    this.router.navigate(['/register']);
  }
}