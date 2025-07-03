import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Order, OrderLocation, OrderUpdateRequest } from '../../interfaces/order.interface';

// Componente para editar un pedido existente
@Component({
  selector: 'app-editar-pedido',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar_pedido.component.html',
  styleUrls: ['./editar_pedido.component.css']
})
export class EditarPedidoComponent implements OnInit, OnDestroy {
  pedidoId: number | null = null; // Almacena el ID del pedido que se está editando
  editPedidoForm!: FormGroup;     // Formulario reactivo para la edición del pedido
  errorMessage: string = '';      // Mensaje de error para mostrar al usuario
  isLoading: boolean = false;     // Indicador de estado de carga

  // Lista de estados posibles para un pedido, usada para el select en el formulario
  estados: string[] = ['pending', 'in_progress', 'delivered', 'cancelled'];

  // Propiedades para mostrar info del usuario logeado
  usuarioId: string = '';   // Se obtiene desde localStorage
  userName: string = '';    // Se obtiene desde localStorage

   // Objeto Subscription para manejar todas las suscripciones y desuscribirse en ngOnDestroy
  private subscriptions: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  // Método de ciclo de vida que se ejecuta al inicializar el componente
  // Aca se carga la información del usuario y se inicializa el formulario reactivo
  // También se carga el pedido a editar si se proporciona un ID válido en la ruta
  async ngOnInit(): Promise<void> {
    this.loadCurrentUserInfo(); // Cargar la información del usuario (email, id[que no lo da en realidad xd])

    // Inicialización de `editPedidoForm` con `FormGroup` y `FormControl` anidados
    // y sus respectivas validaciones.
    this.editPedidoForm = new FormGroup({
      status: new FormControl('', Validators.required),
      location: new FormGroup({
        street: new FormControl('', Validators.required),
        number: new FormControl('', Validators.required),
        cityId: new FormControl(null, [Validators.required, Validators.pattern(/^\d+$/)]),
        location: new FormGroup({ 
          lat: new FormControl(null, [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]),
          lng: new FormControl(null, [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)])
        })
      })
    });

    // Intenta obtener el ID del pedido de los parámetros de la URL
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.pedidoId = parseInt(idParam, 10); // Parsear el ID a número
      // Valida si el ID es un número válido
      if (isNaN(this.pedidoId)) {
        this.errorMessage = 'ID de pedido inválido.';
        console.error(this.errorMessage);
        this.router.navigate(['/lista-pedidos']); // Redirige si el ID es inválido
        return;
      }
      this.cargarPedido(this.pedidoId); // Carga los datos del pedido si el ID es válido

    } else {
      // Si no se proporciona un ID en la URL
      this.errorMessage = 'No se proporcionó un ID de pedido para editar.';
      console.error(this.errorMessage);
      this.router.navigate(['/lista-pedidos']); // Redirige si falta el ID
    }
  }

  // Método del ciclo de vida de Angular que se ejecuta justo antes de que el componente sea destruido
  // Se utiliza para desuscribirse de todas las suscripciones de Observables y evitar fugas de memoria.
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); // Desuscribe todas las suscripciones agregadas a este objeto
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
  }

  cargarPedido(id: number): void {
    this.isLoading = true; // Activa el indicador de carga
    this.errorMessage = ''; // Limpia cualquier mensaje de error previo
    const orderSubscription = this.orderService.getOrderById(id).subscribe({
    // Rellena el formulario con los datos del pedido cargado usando `patchValue`
      next: (pedido: Order) => {
        this.editPedidoForm.patchValue({
          status: pedido.status,
          location: {
            street: pedido.location.street,
            number: pedido.location.number,
            cityId: pedido.location.cityId,
            location: {
              lat: pedido.location.location.lat,
              lng: pedido.location.location.lng
            }
          }
        });

        this.isLoading = false; // Desactiva el indicador de carga
      },
      error: (error: any) => {
        console.error('Error al cargar el pedido para edición:', error);
        this.errorMessage = error.message || 'No se pudo cargar el pedido. Intente de nuevo más tarde.';
        this.isLoading = false;
        this.router.navigate(['/lista-pedidos']); // Redirigir si no se puede cargar el pedido
      }
    });
    this.subscriptions.add(orderSubscription); // Añade la suscripción para gestión en ngOnDestroy
  }

  // Método para guardar los cambios del pedido editado
  guardarCambios(): void {
    this.errorMessage = '';
    this.editPedidoForm.markAllAsTouched(); // Marcar todos los controles como 'touched' para mostrar los errores

    // Verifica si el formulario es válido y si se tiene un ID de pedido
    if (this.editPedidoForm.valid && this.pedidoId !== null) {
      this.isLoading = true;
      // Convierte los datos del formulario a la interfaz OrderUpdateRequest esperada por la API
      // Angular Reactive Forms se encarga de que la estructura coincida
      const pedidoParaAPI: OrderUpdateRequest = this.editPedidoForm.value as OrderUpdateRequest;

      const updateSubscription = this.orderService.updateOrder(this.pedidoId, pedidoParaAPI).subscribe({
        next: (response) => {
          alert('Pedido actualizado con éxito!'); // Alerta de éxito al usuario
          this.isLoading = false;
          this.router.navigate(['/lista-pedidos']); // Redirige a la lista de pedidos después de guardar
        },

        error: (error: any) => {
          console.error('Error al actualizar el pedido:', error);
          this.errorMessage = error.message || 'Error al actualizar el pedido. Intente de nuevo.';
          this.isLoading = false;
        }
      });
      this.subscriptions.add(updateSubscription);
    } else {
      // Si el formulario no es válido, muestra un mensaje de error general
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
    }
  }

  // Método para cancelar la edición del pedido y redirigir a la lista de pedidos
  cancelar(): void {
    this.router.navigate(['/lista-pedidos']); // Volver a la lista de pedidos
  }

  // Getters para acceder a los controles del formulario de manera más fácil
  get formControls() {
    return this.editPedidoForm.controls;
  }

  get locationControls() {
    return (this.editPedidoForm.get('location') as FormGroup).controls;
  }

  get nestedLocationControls() {
    return ((this.editPedidoForm.get('location') as FormGroup).get('location') as FormGroup).controls;
  }
}
