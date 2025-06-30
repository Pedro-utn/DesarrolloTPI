// src/app/pages/lista_pedidos/lista_pedidos.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Order, PaginationQueryParams } from '../../interfaces/order.interface';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-lista-pedidos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lista_pedidos.component.html',
  styleUrls: ['./lista_pedidos.component.css']
})
export class ListaPedidosComponent implements OnInit {
  pedidos: Order[] = []; // Array para almacenar los pedidos
  paginaActual: number = 1;
  pedidosPorPagina: number = 10;
  pedidoSeleccionado: Order | null = null; // Para manejar la selección de una fila
  isLoading: boolean = false; //Para mostrar un mensaje de carga
  errorMessage: string = ''; //Para mostrar errores de la API
  hayMasPaginas: boolean = true; //Para controlar el boton "Siguiente"

  constructor(
    private router: Router,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.cargarPedidos(); // Carga los pedidos de la API al iniciarse
  }

  // Metodo para cargar pedidos desde la API
  cargarPedidos(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.pedidoSeleccionado = null;

    const params: PaginationQueryParams = {
      page: this.paginaActual,
      quantity: this.pedidosPorPagina
    };

    // Llama al metodo getOrders
    this.orderService.getOrders(params).subscribe({
      next: (responsePedidos: Order[]) => {
        this.pedidos = responsePedidos; // Asigna los pedidos rescibidos
        this.isLoading = false; 
        
        // Determina si hay mas paginas
        this.hayMasPaginas = responsePedidos.length === this.pedidosPorPagina;
      },
      error: (error) => {
        console.error('Error al cargar los pedidos:', error);
        this.errorMessage = error.message || 'Error al cargar los pedidos desde el servidor.';
        this.isLoading = false; // Desactiva el estado de carga en caso de error
        this.pedidos = []; // Limpiar la tabla en caso de error
        this.hayMasPaginas = false; // Si hubo un error, asumimos que no hay más páginas por ahora.
      }
    });
  }

  // Lógica de paginación
  cambiarPagina(delta: number): void {
    const nuevaPagina = this.paginaActual + delta;

    // Valida para el boton Anterior
    if (delta < 0 && nuevaPagina >= 1) {
      this.paginaActual = nuevaPagina;
      this.cargarPedidos();
    }
    // Valida para el boton Siguiente
    else if (delta > 0 && this.hayMasPaginas) {
      this.paginaActual = nuevaPagina;
      this.cargarPedidos();
    }
  }

  // Métodos para los botones de acción
  seleccionarPedido(pedido: Order): void {
    this.pedidoSeleccionado = pedido;
    console.log('Pedido seleccionado:', this.pedidoSeleccionado);
  }

  verPedido(): void {
    if (this.pedidoSeleccionado) {
      alert(`Ver Pedido ID: ${this.pedidoSeleccionado.id}`);

      // Aquí podrías navegar a una ruta de detalle:
    
    } else {
      alert('Por favor, selecciona un pedido para ver.');
    }
  }

  editarPedido(): void {
    if (this.pedidoSeleccionado) {
      this.router.navigate(['/editar-pedido', this.pedidoSeleccionado.id]);
    } else {
      alert('Por favor, selecciona un pedido para editar.');
    }
  }

  // --- Método para eliminar un pedido (usando el OrderService, pero no lo habilitamos todavía) ---
  eliminarPedido(): void {
    if (this.pedidoSeleccionado) {
      if (confirm(`¿Estás seguro de que quieres eliminar el pedido ID: ${this.pedidoSeleccionado.id}?`)) {
        this.isLoading = true;
        this.orderService.deleteOrder(this.pedidoSeleccionado.id).subscribe({
          next: () => {
            console.log(`Pedido ID: ${this.pedidoSeleccionado?.id} eliminado con éxito.`);
            alert(`Pedido ID: ${this.pedidoSeleccionado?.id} eliminado.`);
            this.pedidoSeleccionado = null;
            // Después de eliminar, recarga los pedidos para actualizar la tabla.
            // Es buena práctica intentar ir a la página actual o a la primera si la actual queda vacía.
            // Para simplificar, recargamos la página actual.
            this.cargarPedidos();
          },
          error: (error: any) => {
            console.error('Error al eliminar el pedido:', error);
            this.errorMessage = error.message || 'Error al eliminar el pedido.';
            this.isLoading = false;
          }
        });
      }
    } else {
      alert('Por favor, selecciona un pedido para eliminar.');
    }
  }
  // --- FIN CAMBIO (eliminarPedido) ---

  agregarPedido(): void {
    this.router.navigate(['/nuevo-pedido']);
  }
}