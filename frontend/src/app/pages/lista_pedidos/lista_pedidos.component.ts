import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Order, PaginationQueryParams } from '../../interfaces/order.interface';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-lista-pedidos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lista_pedidos.component.html',
  styleUrls: ['./lista_pedidos.component.css']
})
export class ListaPedidosComponent implements OnInit {
  pedidos: Order[] = [];
  paginaActual: number = 1;
  pedidosPorPagina: number = 10;
  pedidoSeleccionado: Order | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';
  hayMasPaginas: boolean = true;

  // Permisos
  hasDeletePermission = false;
  hasCreatePermission = false;
  hasPatchPermission = false;

  constructor(
    private router: Router,
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarPedidos();
    this.verificarPermisos();
  }

  verificarPermisos(): void {
    this.authService.validatePermission('deleteOrder').subscribe({
      next: (result) => {
        this.hasDeletePermission = result;
        console.log('✅ Permiso deleteOrder:', result);
      },
      error: (err) => {
        console.warn('❌ Error verificando deleteOrder:', err);
        this.hasDeletePermission = false;
      }
    });

    this.authService.validatePermission('createOrder').subscribe({
      next: (result) => {
        this.hasCreatePermission = result;
        console.log('✅ Permiso createOrder:', result);
      },
      error: (err) => {
        console.warn('❌ Error verificando createOrder:', err);
        this.hasCreatePermission = false;
      }
    });

    this.authService.validatePermission('patchOrder').subscribe({
      next: (result) => {
        this.hasPatchPermission = result;
        console.log('✅ Permiso patchOrder:', result);
      },
      error: (err) => {
        console.warn('❌ Error verificando patchOrder:', err);
        this.hasPatchPermission = false;
      }
    });
  }

  cargarPedidos(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.pedidoSeleccionado = null;

    const params: PaginationQueryParams = {
      page: this.paginaActual,
      quantity: this.pedidosPorPagina
    };

    this.orderService.getOrders(params).subscribe({
      next: (responsePedidos: Order[]) => {

        this.pedidos = responsePedidos; // Asigna los pedidos rescibidos
        this.isLoading = false; 

        this.ordenarPedidosPorId(); // Ordenar los pedidos por ID después de cargarlos

        // Determina si hay mas paginas
        this.pedidos = responsePedidos;
        this.isLoading = false;
        this.hayMasPaginas = responsePedidos.length === this.pedidosPorPagina;
        console.log('📦 Pedidos cargados:', responsePedidos);
      },
      error: (error) => {
        console.error('❌ Error al cargar los pedidos:', error);
        this.errorMessage = error.message || 'Error al cargar los pedidos desde el servidor.';
        this.isLoading = false;
        this.pedidos = [];
        this.hayMasPaginas = false;
      }
    });
  }

  // Método para ordenar los pedidos por ID (ascendente)
  ordenarPedidosPorId(): void {
    this.pedidos.sort((a, b) => a.id - b.id);
  }

  cambiarPagina(delta: number): void {
    const nuevaPagina = this.paginaActual + delta;

    if (delta < 0 && nuevaPagina >= 1) {
      this.paginaActual = nuevaPagina;
      this.cargarPedidos();
    } else if (delta > 0 && this.hayMasPaginas) {
      this.paginaActual = nuevaPagina;
      this.cargarPedidos();
    }
  }

  seleccionarPedido(pedido: Order): void {
    this.pedidoSeleccionado = pedido;
    console.log('📌 Pedido seleccionado:', this.pedidoSeleccionado);
  }

  verPedido(): void {
    if (this.pedidoSeleccionado) {
      this.router.navigate(['/ver-pedido', this.pedidoSeleccionado.id]);
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

  eliminarPedido(): void {
    if (this.pedidoSeleccionado) {
      if (confirm(`¿Estás seguro de que quieres eliminar el pedido ID: ${this.pedidoSeleccionado.id}?`)) {
        this.isLoading = true;
        this.orderService.deleteOrder(this.pedidoSeleccionado.id).subscribe({
          next: () => {
            console.log(`🗑️ Pedido ID: ${this.pedidoSeleccionado?.id} eliminado.`);
            alert(`Pedido ID: ${this.pedidoSeleccionado?.id} eliminado.`);
            this.pedidoSeleccionado = null;
            this.cargarPedidos();
          },
          error: (error: any) => {
            console.error('❌ Error al eliminar el pedido:', error);
            this.errorMessage = error.message || 'Error al eliminar el pedido.';
            this.isLoading = false;
          }
        });
      }
    } else {
      alert('Por favor, selecciona un pedido para eliminar.');
    }
  }

  agregarPedido(): void {
    this.router.navigate(['/nuevo-pedido']);
  }

// Método para navegar hacia atrás
  volverAtras(): void {
    this.router.navigate(['/home']);
  }

}