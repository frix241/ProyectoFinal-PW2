import { Routes } from '@angular/router';
import { Login } from './login/login';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'cliente', loadComponent: () => import('./cliente/cliente').then(m => m.Cliente) },
  { path: 'restaurante', loadComponent: () => import('./restaurante-panel/restaurante-panel').then(m => m.RestaurantePanel) },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
