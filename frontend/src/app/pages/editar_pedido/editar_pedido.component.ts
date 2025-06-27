import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

// Simulación de una interfaz para el Pedido
interface Pedido {
  id: string;
  userId: string;
  userName: string;
  deliveryOption: string;
  product: string;
  restaurant: string;
  direccion: string;
  localidad: string;
  estado: string;
}

@Component({
  selector: 'app-editar-pedido',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar_pedido.component.html',
  styleUrls: ['./editar_pedido.component.css']
})
export class EditarPedidoComponent implements OnInit {
  pedidoId: string | null = null;
  editPedidoForm!: FormGroup;
  errorMessage: string = '';

  // Datos simulados para los selectores
  deliveryOptions: string[] = ['A domicilio', 'Retiro en local'];
  products: string[] = ['Pizza', 'Hamburguesa', 'Ensalada', 'Sushi'];
  restaurants: string[] = ['Restaurante A', 'Restaurante B', 'Restaurante C'];
  localidades: string[] = ['Villa María', 'Córdoba Capital', 'Buenos Aires'];
  estados: string[] = ['Pendiente', 'En Progreso', 'Entregado', 'Cancelado']; // ✅ Opciones para el estado

  // Datos de usuario simulados (podrían venir del AuthService)
  usuarioId: string = '03';
  userName: string = 'Pedro';

  constructor(
    private route: ActivatedRoute, // Para obtener el ID de la URL
    private router: Router
    // private apiService: ApiService // Si tuvieras un servicio real para obtener/actualizar pedidos
  ) {}

  ngOnInit(): void {
    // Inicializar el formulario reactivo
    this.editPedidoForm = new FormGroup({
      deliveryOption: new FormControl('', Validators.required),
      product: new FormControl('', Validators.required),
      restaurant: new FormControl('', Validators.required),
      direccion: new FormControl('', Validators.required),
      localidad: new FormControl('', Validators.required),
      estado: new FormControl('', Validators.required) // ✅ Campo de estado para el formulario
    });

    // Obtener el ID del pedido de la URL
    this.pedidoId = this.route.snapshot.paramMap.get('id');

    if (this.pedidoId) {
      this.cargarPedido(this.pedidoId); // Cargar los datos del pedido si hay un ID
    } else {
      this.errorMessage = 'No se proporcionó un ID de pedido para editar.';
      console.error(this.errorMessage);
      // Redirigir o manejar el error
      this.router.navigate(['/home']);
    }
  }

  // Simulación de carga de datos del pedido
  private cargarPedido(id: string): void {
    console.log(`Cargando pedido con ID: ${id}`);
    // En una aplicación real, aquí se haría una llamada al ApiService:
    // this.apiService.getPedidoById(id).subscribe(
    //   (pedido: Pedido) => {
    //     this.editPedidoForm.patchValue(pedido); // Rellenar el formulario con los datos del pedido
    //   },
    //   (error) => {
    //     console.error('Error al cargar el pedido:', error);
    //     this.errorMessage = 'No se pudo cargar el pedido. Intente de nuevo más tarde.';
    //   }
    // );

    // Para la simulación:
    const mockPedido: Pedido = {
      id: id,
      userId: this.usuarioId,
      userName: this.userName,
      deliveryOption: 'A domicilio',
      product: 'Hamburguesa',
      restaurant: 'Restaurante B',
      direccion: 'Marcos Juarez 941',
      localidad: 'Villa María',
      estado: 'En Progreso' // Estado inicial simulado
    };
    this.editPedidoForm.patchValue(mockPedido); // Rellenar el formulario con datos simulados
    console.log('Pedido simulado cargado:', mockPedido);
  }

  async guardarCambios() {
    this.errorMessage = '';
    if (this.editPedidoForm.valid && this.pedidoId) {
      const pedidoActualizado: Pedido = {
        id: this.pedidoId,
        userId: this.usuarioId, // Mantener userId
        userName: this.userName, // Mantener userName
        ...this.editPedidoForm.value // Obtener todos los valores del formulario
      };
      console.log('Guardando cambios del pedido:', pedidoActualizado);

      // En una aplicación real, aquí se haría una llamada al ApiService:
      // try {
      //   await this.apiService.updatePedido(this.pedidoId, pedidoActualizado);
      //   alert('Pedido actualizado con éxito!');
      //   this.router.navigate(['/home']); // O a una página de detalle de pedidos
      // } catch (error) {
      //   console.error('Error al actualizar el pedido:', error);
      //   this.errorMessage = 'Error al actualizar el pedido. Intente de nuevo.';
      // }

      // Para la simulación:
      alert('Pedido actualizado con éxito (simulado)!');
      this.router.navigate(['/home']); // Navegar a Home o donde corresponda
    } else {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
      this.editPedidoForm.markAllAsTouched();
    }
  }

  cancelar() {
    console.log('Edición de pedido cancelada.');
    this.router.navigate(['/home']); // Volver a la página de inicio o a la lista de pedidos
  }

  get formControls() {
    return this.editPedidoForm.controls;
  }
}