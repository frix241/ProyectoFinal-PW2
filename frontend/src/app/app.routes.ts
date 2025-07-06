import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Cliente } from './cliente/cliente';
import { RestaurantePanel } from './restaurante-panel/restaurante-panel';
import { Register } from './register/register';
export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'cliente', component: Cliente },
  { path: 'restaurante', component: RestaurantePanel },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
