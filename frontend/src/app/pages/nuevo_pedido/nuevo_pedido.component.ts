// src/app/pages/nuevo_pedido/nuevo_pedido.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { NewOrderRequest } from '../../interfaces/order.interface';

// Custom validator for comma-separated numbers
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

@Component({
  selector: 'app-nuevo-pedido',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './nuevo_pedido.component.html',
  styleUrls: ['./nuevo_pedido.component.css']
})
export class NuevoPedidoComponent implements OnInit {

  usuarioId: string = '';  // Se obtiene desde localStorage
  userName: string = '';   // Se obtiene desde localStorage

  newPedidoForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.loadUserData();
    this.initializeForm();
  }
  
  private loadUserData(): void {
    const storedId = localStorage.getItem('userId');
    const storedEmail = localStorage.getItem('userEmail');

    if (storedId && storedEmail) {
      this.usuarioId = storedId;
      this.userName = storedEmail;
    } else {
      this.errorMessage = 'No se encontró información del usuario. Iniciando sesión nuevamente.';
      // Dar un pequeño retraso antes de redirigir para que el usuario pueda ver el mensaje
      setTimeout(() => {
        this.authService.logout();
      }, 2000);
    }
  }

  private initializeForm(): void {
    this.newPedidoForm = new FormGroup({
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
    const productIds: number[] = formValues.productsInput
                                            .split(',')
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
        this.router.navigate(['/lista-pedidos']); // Redirigir a la lista de pedidos
      },
      error: (error: any) => { 
        console.error('Error al agregar el pedido en el componente:', error);
        // Manejo específico para errores de autenticación/autorización
        if (error.status === 401 || error.status === 403) {
            this.errorMessage = 'Sesión expirada o no autorizada. Por favor, inicia sesión de nuevo.';
            this.authService.logout();
        } else {
            // Usa el mensaje del backend si está disponible, o uno genérico
            this.errorMessage = error.error?.message || error.message || 'Hubo un problema al agregar el pedido.';
        }
      }
    });
  }

  cancelar(): void {
    console.log('Creación de pedido cancelada.');
    this.router.navigate(['/lista-pedidos']); // Redirigir a la lista de pedidos
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