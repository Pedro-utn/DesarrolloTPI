//Importación de Componentes
import { Routes } from '@angular/router';
import { TemplateComponent } from './pages/template/template.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { NuevoPedidoComponent } from './pages/nuevo_pedido/nuevo_pedido.component';
import { EditarPedidoComponent } from './pages/editar_pedido/editar_pedido.component';
import { ListaPedidosComponent } from './pages/lista_pedidos/lista_pedidos.component';
import { VerPedidoComponent } from './pages/ver_pedido/ver_pedido.component';
import { authGuard } from './auth.guard';

// Esta clase se encarga de redirigir a las rutas correspondientes
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'home',
    component: TemplateComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: HomeComponent }
    ]
  },
  {
    path: 'nuevo-pedido',
    component: NuevoPedidoComponent,
    canActivate: [authGuard] // Protege la ruta 'nuevo_pedido'
  },
  {
    path: 'editar-pedido/:id',
    component: EditarPedidoComponent,
    canActivate: [authGuard] // Protege la ruta 'editar_pedido'
  },
  {
    path: 'lista-pedidos',
    component: ListaPedidosComponent,
    canActivate: [authGuard] // Protege la ruta 'lista_pedidos'
  },
  {
    path: 'ver-pedido/:id',
    component: VerPedidoComponent,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/login' }
];
