import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

// Componente de la página de inicio
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {
  // Inyecta AuthService en el constructor
  constructor(
    private router: Router,
    private authService: AuthService // Inyecta el AuthService
  ) { }

  // Método para cerrar sesión
  logout() {
    this.authService.logout(); // Llama al método logout del AuthService
  }

  viewPaymentsList() {
    console.log('Botón "Ver Lista de Pagos" presionado. Funcionalidad pendiente.');
  }

  // Método para navegar hacia atrás
  volverAtras(): void {
    this.router.navigate(['/login']);
  }
}