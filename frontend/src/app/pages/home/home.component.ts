import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
//import { AuthService } from '../../auth.service'; // NO INYECTAMOS AUTHSERVICE POR AHORA PARA SIMULAR

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private router: Router) { } // Solo inyectamos Router

  goToNuevoPedido() {
    this.router.navigate(['/nuevo-pedido']);
  }

  goToEditPedido(id: string) {
    this.router.navigate(['/editar-pedido', id]);
  }

  logout() {
    // SIMULACIÓN DE LOGOUT: Directamente navega a login
    console.log('HomeComponent: Simulación de logout, navegando a /login');
    this.router.navigate(['/login']);
  }
}