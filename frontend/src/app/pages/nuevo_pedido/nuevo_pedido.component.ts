import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms'; // Importa ReactiveFormsModule y AbstractControl

// Custom validator for comma-separated numbers
function commaSeparatedNumbersValidator(control: AbstractControl): { [key: string]: any } | null {
  const value = control.value;
  if (!value) {
    return null; // Let Validators.required handle empty value
  }
  const parts = value.split(',').map((part: string) => part.trim());
  // Check if all parts are valid numbers and not empty strings after trimming
  const allNumbers = parts.every((part: string) => !isNaN(Number(part)) && part !== '');
  if (!allNumbers) {
    return { 'commaSeparatedNumbers': { value: control.value } };
  }
  return null;
}

// Interfaz que representa el payload exacto que el backend espera para el POST /order
interface NewOrderRequest {
  userId: string;
  restaurantId: number;
  products: number[]; // <--- array de números
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
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './nuevo_pedido.component.html',
  styleUrls: ['./nuevo_pedido.component.css']
})
export class NuevoPedidoComponent implements OnInit {

  usuarioId: string = '03';
  userName: string = 'Pedro';

  newPedidoForm!: FormGroup;
  errorMessage: string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.newPedidoForm = new FormGroup({
      restaurantId: new FormControl(null, [Validators.required, Validators.pattern(/^\d+$/)]),
      productsInput: new FormControl('', [Validators.required, commaSeparatedNumbersValidator]), // <--- Nuevo FormControl para la entrada de productos como string
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
    if (this.newPedidoForm.valid) {
      const formValues = this.newPedidoForm.value;

      // Parsear la cadena de productos a un array de números
      const productIds: number[] = formValues.productsInput.split(',')
                                    .map((idStr: string) => parseInt(idStr.trim(), 10)) // Renombrado a idStr para claridad
                                    .filter((id: number) => !isNaN(id)); // Filtrar cualquier NaN si la entrada no es válida, con tipo explícito

      const pedidoParaAPI: NewOrderRequest = {
        userId: this.usuarioId,
        restaurantId: parseInt(formValues.restaurantId, 10),
        products: productIds, // <--- Asignar el array de números
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

      console.log('Pedido a agregar (para API):', pedidoParaAPI);

      // Simular envío de datos
      alert('Pedido agregado con éxito (simulado)!');
      this.router.navigate(['/home']);
    } else {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
      this.newPedidoForm.markAllAsTouched();
    }
  }

  cancelar() {
    console.log('Creación de pedido cancelada.');
    this.router.navigate(['/home']);
  }

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
