import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // Importar RouterModule y Router

// Interfaz para la estructura de un pedido (similar a la de editar-pedido)
interface Pedido {
  id: string;
  estado: string;
  delivery: string | null;
  productos: string;
  restaurante: string;
  direccion: string;
  // Puedes añadir más propiedades si las necesitas en la tabla
}

@Component({
  selector: 'app-lista-pedidos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lista_pedidos.component.html',
  styleUrls: ['./lista_pedidos.component.css']
})
export class ListaPedidosComponent implements OnInit {
  pedidos: Pedido[] = []; // Array para almacenar los pedidos
  pedidosPaginados: Pedido[] = []; // Pedidos mostrados en la página actual
  paginaActual: number = 1;
  pedidosPorPagina: number = 5; // Cantidad de pedidos a mostrar por página
  totalPaginas: number = 0;
  pedidoSeleccionado: Pedido | null = null; // Para manejar la selección de una fila

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.cargarPedidosSimulados(); // Cargar datos simulados al iniciar
    this.calcularPaginacion();
    this.actualizarPedidosPaginados();
  }

  // Simulación de carga de pedidos
  cargarPedidosSimulados(): void {
    this.pedidos = [
      { id: '654', estado: 'Pendiente', delivery: '0023', productos: 'Pizza Especial, Hamburguesa Doble', restaurante: 'Kabra', direccion: 'Catamarca 1891' },
      { id: '655', estado: 'Entregado', delivery: null, productos: 'Empanadas JyQ x12', restaurante: 'Stop', direccion: 'Mendoza 1020' },
      { id: '656', estado: 'Pendiente', delivery: null, productos: 'Lomito XXXL', restaurante: 'Punto 22', direccion: 'Juan Müller 780' },
      { id: '657', estado: 'En Progreso', delivery: '0068', productos: 'Porción Papas Grande', restaurante: 'Quinino', direccion: 'Antonio Sobral 867' },
      { id: '658', estado: 'En Progreso', delivery: '6548', productos: 'Pizza Común, Empanadas Árabes x6', restaurante: 'Mansilla', direccion: 'Maipú 123' },
      { id: '659', estado: 'En Progreso', delivery: '6548', productos: 'Hamburguesa Bacon, Porción Papas', restaurante: "Beto's", direccion: 'Corrientes 548' },
      { id: '660', estado: 'Entregado', delivery: '6070', productos: 'Pizza 4 Quesos', restaurante: 'Junior B', direccion: 'Viamonte 1043' },
      { id: '661', estado: 'Pendiente', delivery: null, productos: 'HamburPizza XL', restaurante: 'The One', direccion: 'Ascasubi 324' },
      { id: '662', estado: 'Pendiente', delivery: '1111', productos: 'Chori con fritas', restaurante: 'Puesto 23', direccion: 'Chile 500' },
      { id: '663', estado: 'Entregado', delivery: '2222', productos: 'Milanesa con puré', restaurante: 'El Fogón', direccion: 'Urquiza 750' },
      // Agrega más datos simulados si lo necesitas
    ];
    // Ordenar por ID para que siempre aparezcan en el mismo orden
    this.pedidos.sort((a, b) => parseInt(a.id) - parseInt(b.id));
  }

  // Lógica de paginación
  calcularPaginacion(): void {
    this.totalPaginas = Math.ceil(this.pedidos.length / this.pedidosPorPagina);
  }

  actualizarPedidosPaginados(): void {
    const inicio = (this.paginaActual - 1) * this.pedidosPorPagina;
    const fin = inicio + this.pedidosPorPagina;
    this.pedidosPaginados = this.pedidos.slice(inicio, fin);
    this.pedidoSeleccionado = null; // Limpiar selección al cambiar de página
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.actualizarPedidosPaginados();
    }
  }

  // Métodos para los botones de acción
  seleccionarPedido(pedido: Pedido): void {
    this.pedidoSeleccionado = pedido;
    console.log('Pedido seleccionado:', this.pedidoSeleccionado);
  }

  verPedido(): void {
    if (this.pedidoSeleccionado) {
      alert(`Ver Pedido ID: ${this.pedidoSeleccionado.id}`);
      // Aquí podrías navegar a una ruta de detalle:
      // this.router.navigate(['/ver-pedido', this.pedidoSeleccionado.id]);
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
        // Simular eliminación
        this.pedidos = this.pedidos.filter(p => p.id !== this.pedidoSeleccionado?.id);
        this.calcularPaginacion(); // Recalcular paginación
        if (this.paginaActual > this.totalPaginas && this.totalPaginas > 0) {
          this.paginaActual = this.totalPaginas; // Si la página actual excede el total, ir a la última
        } else if (this.totalPaginas === 0) {
          this.paginaActual = 1; // Si no hay pedidos, ir a la página 1
        }
        this.actualizarPedidosPaginados(); // Actualizar la vista
        alert(`Pedido ID: ${this.pedidoSeleccionado.id} eliminado (simulado).`);
        this.pedidoSeleccionado = null; // Limpiar selección
      }
    } else {
      alert('Por favor, selecciona un pedido para eliminar.');
    }
  }

  agregarPedido(): void {
    this.router.navigate(['/nuevo-pedido']);
  }

  // Método para obtener un array de números de página para el ngFor
  get paginasArray(): number[] {
    return Array(this.totalPaginas).fill(0).map((x, i) => i + 1);
  }
}