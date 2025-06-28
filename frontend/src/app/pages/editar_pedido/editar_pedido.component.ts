import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

// Interfaz para la estructura del payload de la API para la actualización (PUT)
interface OrderUpdateRequest {
  status: string;
  location: {
    street: string;
    number: string;
    cityId: number;
    location: {
      lat: number;
      lng: number;
    };
  };
}

// Interfaz extendida para la representación completa del pedido en el frontend (podría venir de un GET /order/:id)
// He mantenido los campos originales que tenías, asumiendo que un GET de la API podría devolver más datos.
// Pero para el PUT, solo se enviarán 'status' y 'location'.
interface PedidoFrontend {
  id: string;
  userId: string;
  userName: string;
  deliveryOption: string; // Mantenido para simular la carga completa si fuera necesario
  product: string; // Mantenido para simular la carga completa si fuera necesario
  restaurant: string; // Mantenido para simular la carga completa si fuera necesario
  direccion: string; // Mantenido para simular la carga completa si fuera necesario (aunque se mapeará a street/number)
  localidad: string; // Mantenido para simular la carga completa si fuera necesario (aunque se mapeará a cityId)
  status: string; // Renombrado de 'estado' a 'status'
  location: { // Nuevo campo 'location'
    street: string;
    number: string;
    cityId: number;
    location: {
      lat: number;
      lng: number;
    };
  };
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

  // Opciones para el estado (status)
  estados: string[] = ['pending', 'in_progress', 'delivered', 'cancelled'];

  // Datos de usuario simulados (podrían venir del AuthService)
  usuarioId: string = '03';
  userName: string = 'Pedro';

  constructor(
    private route: ActivatedRoute, // Para obtener el ID de la URL
    private router: Router
    // private apiService: ApiService // Si tuvieras un servicio real para obtener/actualizar pedidos
  ) {}

  ngOnInit(): void {
    // Inicializar el formulario reactivo con la nueva estructura
    this.editPedidoForm = new FormGroup({
      status: new FormControl('', Validators.required), // Campo para el estado
      location: new FormGroup({ // Grupo para los datos de ubicación
        street: new FormControl('', Validators.required),
        number: new FormControl('', Validators.required),
        cityId: new FormControl(null, [Validators.required, Validators.pattern(/^\d+$/)]), // cityId como número
        location: new FormGroup({ // Grupo anidado para latitud y longitud
          lat: new FormControl(null, [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]), // latitud como número
          lng: new FormControl(null, [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]) // longitud como número
        })
      })
    });

    // Obtener el ID del pedido de la URL
    this.pedidoId = this.route.snapshot.paramMap.get('id');

    if (this.pedidoId) {
      this.cargarPedido(this.pedidoId); // Cargar los datos del pedido si hay un ID
    } else {
      this.errorMessage = 'No se proporcionó un ID de pedido para editar.';
      console.error(this.errorMessage);
      this.router.navigate(['/home']);
    }
  }

  // Simulación de carga de datos del pedido
  private cargarPedido(id: string): void {
    console.log(`Cargando pedido con ID: ${id}`);
    // En una aplicación real, aquí se haría una llamada al ApiService:
    // this.apiService.getPedidoById(id).subscribe(
    //   (pedido: PedidoFrontend) => {
    //     // Mapear los datos de la API a la estructura del formulario si es necesario
    //     // Por ejemplo, si 'direccion' en tu API original era 'street' y 'number'
    //     this.editPedidoForm.patchValue({
    //       status: pedido.status,
    //       location: {
    //         street: pedido.location.street,
    //         number: pedido.location.number,
    //         cityId: pedido.location.cityId,
    //         location: {
    //           lat: pedido.location.location.lat,
    //           lng: pedido.location.location.lng
    //         }
    //       }
    //     });
    //   },
    //   (error) => {
    //     console.error('Error al cargar el pedido:', error);
    //     this.errorMessage = 'No se pudo cargar el pedido. Intente de nuevo más tarde.';
    //   }
    // );

    // Para la simulación:
    const mockPedido: PedidoFrontend = {
      id: id,
      userId: this.usuarioId,
      userName: this.userName,
      deliveryOption: 'A domicilio', // Campo original mantenido para simulación completa
      product: 'Hamburguesa', // Campo original mantenido para simulación completa
      restaurant: 'Restaurante B', // Campo original mantenido para simulación completa
      direccion: 'Marcos Juarez 941', // Campo original mantenido para simulación completa
      localidad: 'Villa María', // Campo original mantenido para simulación completa
      status: 'in_progress', // Estado inicial simulado según la nueva interfaz
      location: {
        street: 'Av. Nueva',
        number: '843',
        cityId: 2,
        location: {
          lat: -32.0,
          lng: -63.1
        }
      }
    };
    // PatchValue directamente con la estructura del formulario
    this.editPedidoForm.patchValue({
      status: mockPedido.status,
      location: {
        street: mockPedido.location.street,
        number: mockPedido.location.number,
        cityId: mockPedido.location.cityId,
        location: {
          lat: mockPedido.location.location.lat,
          lng: mockPedido.location.location.lng
        }
      }
    });
    console.log('Pedido simulado cargado:', mockPedido);
  }

  async guardarCambios() {
    this.errorMessage = '';
    if (this.editPedidoForm.valid && this.pedidoId) {
      // El payload para la API debe coincidir exactamente con OrderUpdateRequest
      const pedidoParaAPI: OrderUpdateRequest = this.editPedidoForm.value as OrderUpdateRequest;

      console.log('Enviando cambios del pedido a la API (PUT):', pedidoParaAPI);

      // En una aplicación real, aquí se haría una llamada al ApiService:
      // try {
      //   // Asegúrate de que tu apiService.updatePedido(id, payload) acepte el tipo OrderUpdateRequest
      //   await this.apiService.updatePedido(this.pedidoId, pedidoParaAPI);
      //   alert('Pedido actualizado con éxito!');
      //   this.router.navigate(['/home']);
      // } catch (error) {
      //   console.error('Error al actualizar el pedido:', error);
      //   this.errorMessage = 'Error al actualizar el pedido. Intente de nuevo.';
      // }

      // Para la simulación:
      alert('Pedido actualizado con éxito (simulado)!');
      this.router.navigate(['/home']); // Navegar a Home o donde corresponda
    } else {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
      this.editPedidoForm.markAllAsTouched(); // Marcar todos los controles como 'touched' para mostrar errores
    }
  }

  cancelar() {
    console.log('Edición de pedido cancelada.');
    this.router.navigate(['/home']); // Volver a la página de inicio o a la lista de pedidos
  }

  // Getter para acceder fácilmente a los controles del formulario en el HTML
  get formControls() {
    return this.editPedidoForm.controls;
  }

  // Getters para los controles anidados de 'location'
  get locationControls() {
    return (this.editPedidoForm.get('location') as FormGroup).controls;
  }

  get nestedLocationControls() {
    return ((this.editPedidoForm.get('location') as FormGroup).get('location') as FormGroup).controls;
  }
}
