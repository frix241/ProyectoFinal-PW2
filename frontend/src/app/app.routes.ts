import { Routes } from '@angular/router';
import { authGuard } from './services/auth.guard';
import { restaurantGuard } from './services/restaurant.guard';
import { clienteGuard } from './services/cliente.guard';

export const routes: Routes = [
  { 
    path: 'login', 
    loadComponent: () => import('./auth/login/login').then(m => m.LoginComponent) 
  },
  { 
    path: 'register', 
    loadComponent: () => import('./auth/register/register').then(m => m.RegisterComponent) 
  },
  {
    path: 'restaurants/menu-dia',
    loadComponent: () => import('./restaurants/menu-dia/menu-dia').then(m => m.MenuDia),
    canActivate: [restaurantGuard]
  },
  {
    path: 'clientes/explorador-restaurantes',
    loadComponent: () => import('./clientes/explorador-restaurantes/explorador-restaurantes').then(m => m.ExploradorRestaurantes),
    canActivate: [clienteGuard]
  },
/**  {
    path: 'clientes/menu-restaurante',
    loadComponent: () => import('./clientes/menu-restaurante/menu-restaurante').then(m => m.MenuRestauranteComponent),
    canActivate: [clienteGuard]
  },
  {
    path: 'clientes/confirmacion-pedido',
    loadComponent: () => import('./clientes/confirmacion-pedido/confirmacion-pedido').then(m => m.ConfirmacionPedidoComponent),
    canActivate: [clienteGuard]
  },
  {
    path: 'clientes/mis-pedidos',
    loadComponent: () => import('./clientes/mis-pedidos/mis-pedidos').then(m => m.MisPedidosComponent),
    canActivate: [clienteGuard]
  },
*/
  // ...otras rutas protegidas
];