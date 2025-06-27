import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // Importa Router
import { HttpClient, HttpHeaders, HttpClientModule  } from '@angular/common/http'; // ¡Esto es nuevo!

@Component({
  selector: 'app-nuevo-pedido',
  standalone: true, //Configuración de StandAlone components
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './nuevo_pedido.component.html',
  styleUrls: ['./nuevo_pedido.component.css']
})
export class NuevoPedidoComponent implements OnInit {

  usuarioId: string = '03'; // Estos dos campos en realidad se obtienen de un servicio de autenticación
  userName: string = 'Pedro';

  // Modelos para los campos del formulario
  deliveryOption: string = '';
  selectedProduct: string = '';
  selectedRestaurant: string = '';
  direccion: string = '';
  localidad: string = '';

  // Opciones de ejemplo para los dropdowns
  deliveryOptions: string[] = ['A domicilio', 'Retiro en local'];
  products: string[] = ['Pizza', 'Hamburguesa', 'Ensalada'];
  restaurants: string[] = ['Restaurante A', 'Restaurante B', 'Restaurante C'];
  localidades: string[] = ['Villa María', 'Córdoba Capital', 'Buenos Aires']; // Agrega opciones de localidades

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    // Lógica para cargar datos iniciales si fuera necesario,
    // por ejemplo, obtener el ID y nombre del usuario logeado.
  }

  agregarPedido() {
    // Aquí iría la lógica para enviar el pedido al backend
    const pedido = {
      userId: this.usuarioId,
      userName: this.userName,
      deliveryOption: this.deliveryOption,
      product: this.selectedProduct,
      restaurant: this.selectedRestaurant,
      direccion: this.direccion,
      localidad: this.localidad
    };
    
    //Define los encabezados de la solicitud
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }

    //URL de la API REST
    const apiUrl = 'http://localhost:3000/order';
  
    //Realiza la solicitud POST a la API
    this.http.post(apiUrl, pedido, httpOption).subscribe({
      next: (response) => {
        console.log('Pedido agregado con exito:', response);
        this.router.navigate(['/home']); //Redirige la pagina de home
      },
      error: (error) => {
        console.error('Error al agregar el pedido:', error);
      }
    });
  }
  

  cancelar() {
    console.log('Pedido cancelado');
    // Redirigir a la página de home
    this.router.navigate(['/home']);
  }
}