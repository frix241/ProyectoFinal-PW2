import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- importa FormsModule
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true, // <-- si no está, agrégalo
  imports: [FormsModule], // <-- agrega FormsModule aquí
  templateUrl: './login.html'
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private auth: Auth, private router: Router) {}

  onSubmit() {
    this.auth.login({ username: this.username, password: this.password }).subscribe({
      next: (res: any) => {
        this.auth.saveToken(res.access);
        this.router.navigate(['/']);
      },
      error: () => {
        this.error = 'Usuario o contraseña incorrectos';
      }
    });
  }
}