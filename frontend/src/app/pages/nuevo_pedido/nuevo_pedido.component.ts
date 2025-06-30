// src/app/pages/nuevo_pedido/nuevo_pedido.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';

// Custom validator for comma-separated numbers (mantenemos esto aquí, es específico del form)
function commaSeparatedNumbersValidator(control: AbstractControl): { [key: string]: any } | null {
  const value = control.value;
  if (!value) {
    return null;
  }
  const parts = value.split(',').map((part: string) => part.trim());
  const allNumbers = parts.every((part: string) => !isNaN(Number(part)) && part !== '');
  if (!allNumbers) {
    return { 'commaSeparatedNumbers': { value: control.value } };
  }
  return null;
}

// Interfaz para el payload de la orden (la misma que en el OrderService)
interface NewOrderRequest {
  userId: string;
  restaurantId: number;
  products: number[];
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

@Component({
  selector: 'app-nuevo-pedido',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule], // HttpClientModule debe estar importado si no se provee globalmente
  templateUrl: './nuevo_pedido.component.html',
  styleUrls: ['./nuevo_pedido.component.css']
})
export class NuevoPedidoComponent implements OnInit {

  usuarioId: string = '03'; // Esto debería venir de AuthService
  userName: string = 'Pedro'; // Esto debería venir de AuthService

  newPedidoForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private authService: AuthService, // Inyecta AuthService
    private orderService: OrderService // <-- Inyecta el nuevo OrderService
  ) { }

  ngOnInit(): void {
    // Aquí puedes intentar obtener userId y userName del AuthService
    // Por ejemplo, si tu token contiene estos datos, podrías tener un método
    // en AuthService para decodificarlo o devolver un objeto de usuario.
    // Para simplificar, los mantenemos hardcodeados por ahora si no tienes esa lógica.
    // this.usuarioId = this.authService.getUserId() || '03';
    // this.userName = this.authService.getUserName() || 'Pedro';

    this.newPedidoForm = new FormGroup({
      // Validators.pattern(/^\d+$/) asegura que solo sean dígitos para números enteros.
      // Para lat/lng, el pattern permite números con decimales y signo negativo.
      restaurantId: new FormControl(null, [Validators.required, Validators.pattern(/^\d+$/)]),
      productsInput: new FormControl('', [Validators.required, commaSeparatedNumbersValidator]),
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
  }

  agregarPedido() {
    this.errorMessage = '';

    if (this.newPedidoForm.invalid) {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
      this.newPedidoForm.markAllAsTouched();
      return;
    }

    // Obtener los valores del formulario
    const formValues = this.newPedidoForm.value;

    // Parsear la cadena de productos a un array de números
    const productIds: number[] = formValues.productsInput.split(',')
                                                          .map((idStr: string) => parseInt(idStr.trim(), 10))
                                                          .filter((id: number) => !isNaN(id));

    // Construir el payload de la solicitud HTTP
    const pedidoParaAPI: NewOrderRequest = {
      userId: this.usuarioId, // Obtener del AuthService en una aplicación real
      restaurantId: parseInt(formValues.restaurantId, 10),
      products: productIds,
      location: {
        street: formValues.location.street,
        number: formValues.location.number,
        cityId: parseInt(formValues.location.cityId, 10),
        location: {
          lat: parseFloat(formValues.location.location.lat),
          lng: parseFloat(formValues.location.location.lng)
        }
      }
    };

    console.log('Pedido a enviar a la API:', pedidoParaAPI);

    // Llamar al servicio para crear el pedido
    this.orderService.createOrder(pedidoParaAPI).subscribe({
      next: (response) => {
        console.log('Pedido agregado con éxito:', response);
        alert('Pedido agregado con éxito!'); // Usar un modal en lugar de alert en prod
        this.router.navigate(['/home']);
      },
      error: (error: Error) => { // Especificamos el tipo de error como Error
        console.error('Error al agregar el pedido en el componente:', error);
        // Si el error es por token, el AuthService.getAuthHeaders ya lo debería manejar.
        // Aquí mostramos el mensaje de error general o más específico si el servicio lo devuelve.
        this.errorMessage = error.message || 'Hubo un problema al agregar el pedido.';
        // Si el error indica que la sesión expiró (ej. 401), forzamos logout
        if (error.message.includes('Acceso denegado') || error.message.includes('No autorizado')) {
          this.authService.logout();
        }
      }
    });
  }

  cancelar() {
    console.log('Creación de pedido cancelada.');
    this.router.navigate(['/home']);
  }

  // Getters para acceder a los controles del formulario en el HTML
  get formControls() {
    return this.newPedidoForm.controls;
  }

  get locationControls() {
    return (this.newPedidoForm.get('location') as FormGroup).controls;
  }

  get nestedLocationControls() {
    return ((this.newPedidoForm.get('location') as FormGroup).get('location') as FormGroup).controls;
  }
}