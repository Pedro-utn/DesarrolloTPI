import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

// Componente de la página de inicio
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private router: Router) { }

  // Método para navegar a la página de pedidos
  goToNuevoPedido() {
    this.router.navigate(['/nuevo-pedido']); // Navega programáticamente a la ruta '/nuevo-pedido'
  }

  // esto en realidad simula un cierre de sesión
  logout() {
    this.router.navigate(['/login']);
  }
}