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

  // El método goToNuevoPedido() fue eliminado ya que el botón "Nuevo Pedido" fue removido.

  // esto en realidad simula un cierre de sesión
  logout() {
    this.router.navigate(['/login']);
  }

  viewPaymentsList() {
    console.log('Botón "Ver Lista de Pagos" presionado. Funcionalidad pendiente.');
  }

  // Método para navegar hacia atrás
  volverAtras(): void {
    this.router.navigate(['/login']);
  }
}