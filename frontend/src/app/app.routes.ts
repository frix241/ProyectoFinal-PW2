import { Routes } from "@angular/router";
import { Login } from "./login/login";
import { Cliente } from "./cliente/cliente";
import { RestaurantePanel } from "./restaurante-panel/restaurante-panel";
import { Register } from "./register/register";
import { ClienteGuard } from "./guards/cliente.guard";
import { RestauranteGuard } from "./guards/restaurante.guard";
import { PedidosComponent } from "./cliente/pedidos/pedidos";

export const routes: Routes = [
  { path: "login", component: Login },
  { path: "register", component: Register },

  { path: "cliente", component: Cliente, canActivate: [ClienteGuard] },
  {
    path: "cliente/pedidos",
    component: PedidosComponent,
    canActivate: [ClienteGuard],
  },

  {
    path: "restaurante",
    component: RestaurantePanel,
    canActivate: [RestauranteGuard],
  },

  { path: "", redirectTo: "/login", pathMatch: "full" },
];
