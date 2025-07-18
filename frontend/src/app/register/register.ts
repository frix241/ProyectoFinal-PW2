import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth } from '../services/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  username = '';
  password = '';
  confirmPassword = '';
  error = '';
  success = '';
  tipo = '';
  nombreRestaurante = '';

  constructor(private auth: Auth, private router: Router) {}

  get passwordMismatch(): boolean {
    return this.password !== this.confirmPassword && this.confirmPassword !== '';  }

  onRegister(){
    this.error = '';
    this.success = '';

    // Validar campos básicos
    if (!this.username.trim()) {
      this.error = 'El nombre de usuario es requerido';
      return;
    }

    if (!this.password) {
      this.error = 'La contraseña es requerida';
      return;
    }

    if(this.passwordMismatch){
      this.error = "Las contraseñas son distintas";
      return;
    }

    if (!this.tipo) {
      this.error = 'Debes seleccionar un tipo de cuenta';
      return;
    }

    if (this.tipo === 'restaurante' && !this.nombreRestaurante.trim()) {
      this.error = 'Debes ingresar el nombre del restaurante';
      return;
    }

    this.auth.register(this.username, this.password, this.tipo, this.nombreRestaurante || undefined).subscribe({
      next: () => {
        console.log('Registro exitoso, redireccionando a /login');
        this.success = 'Registro exitoso, redireccionando a /login';
        setTimeout(() =>{
          this.router.navigateByUrl('/login');
        },1000);
      },
      error: (err: any) =>{
        console.log("Error durante el registro", err);
        this.error = "No se pudo registrar al usuario";
      }
    });
  }
}
