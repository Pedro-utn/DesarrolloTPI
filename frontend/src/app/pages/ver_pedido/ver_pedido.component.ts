// src/app/pages/detalle_pedido/detalle_pedido.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para ngIf, etc.
import { ActivatedRoute, Router } from '@angular/router'; // Para obtener el ID de la URL y para navegar
import { Order } from '../../interfaces/order.interface'; // Importa Order y OrderLocation
import { OrderService } from '../../services/order.service'; // Importa tu servicio
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-ver-pedido',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ver_pedido.component.html',
  styleUrls: ['./ver_pedido.component.css']
})
export class VerPedidoComponent implements OnInit {
  pedidoId: string | null = null;
  pedido: Order | null = null; 
  isLoading: boolean = true;
  errorMessage: string = '';
  
  usuarioId: string = '';
  userName: string = ''; 

  constructor(
    private route: ActivatedRoute, // Para leer parámetros de la URL (el ID del pedido)
    private router: Router, // Para navegación (ej: el botón "Volver")
    private orderService: OrderService, // Tu servicio para obtener los detalles del pedido
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Obtener el ID del pedido de la URL
    this.pedidoId = this.route.snapshot.paramMap.get('id');
    this.loadCurrentUserInfo();
    if (this.pedidoId) {
      this.cargarPedido(this.pedidoId);
    } else {
      this.errorMessage = 'No se encontró el ID del pedido en la URL.';
      this.isLoading = false;
    }
  }

  // Método para cargar la información del usuario logeado
  loadCurrentUserInfo(): void {
    const storedId = localStorage.getItem('userId');
    const storedEmail = localStorage.getItem('userEmail');
    if (storedId && storedEmail) {
      this.usuarioId = storedId;
      this.userName = storedEmail;
    } else {
      this.errorMessage = 'No se encontró información del usuario en localStorage.';
      this.authService.logout(); // Forzar logout si no hay datos
      }
  };

  // Método para cargar los detalles del pedido usando el servicio
  cargarPedido(id: string): void {
    this.isLoading = true;
    this.errorMessage = ''; // Limpiar cualquier mensaje de error previo

    this.orderService.getOrderById(Number(id)).subscribe({
      next: (responsePedido: Order) => {
        this.pedido = responsePedido; // Asignar el pedido cargado
        this.isLoading = false;
        console.log('Pedido cargado con éxito:', this.pedido);
      },
      error: (error: any) => {
        console.error('Error al cargar el pedido:', error);
        this.errorMessage = error.message || 'Error al cargar los detalles del pedido desde el servidor.';
        this.isLoading = false;
        this.pedido = null; // Asegurarse de que el pedido esté nulo si hay un error
      }
    });
  }

  // Método para el botón "Volver"
  volverALista(): void {
    this.router.navigate(['/lista-pedidos']); // Navega de regreso a la lista de pedidos
  }
}