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


  constructor(private auth: Auth, private router: Router) {}

  get passwordMismatch(): boolean {
    return this.password !== this.confirmPassword && this.confirmPassword !== '';  }

  onRegister(){
    this.error = '';
    this.success = '';

    if(this.passwordMismatch){
      this.error = "Las contraseñas son distintas";
      return;
    }
    this.auth.register(this.username, this.password).subscribe({
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
