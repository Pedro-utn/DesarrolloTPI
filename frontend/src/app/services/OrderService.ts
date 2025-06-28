// src/app/services/order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service'; // Asumo que esta es la ruta a tu AuthService

// Interfaz que representa el payload exacto que el backend espera para el POST /order
// Mantenemos esta interfaz aquí o en un archivo compartido de interfaces
interface NewOrderRequest {
  userId: string; // O number, si tu backend lo espera así
  restaurantId: number;
  products: number[]; // Array de IDs de productos (números)
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

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersApiUrl = 'http://localhost:3000/order'; // URL de tu microservicio de pedidos

  constructor(
    private http: HttpClient,
    private authService: AuthService // Inyectamos AuthService
  ) { }

  /**
   * Envía una solicitud para crear un nuevo pedido al backend.
   * Incluye el token de autorización en los headers.
   * @param orderData Los datos del pedido conforme a la interfaz NewOrderRequest.
   * @returns Un Observable con la respuesta del backend.
   */
  createOrder(orderData: NewOrderRequest): Observable<any> {
    const headers = this.authService.getAuthHeaders(); // Usamos el método del AuthService

    if (!headers) {
      // Si no hay token o no se pudieron construir los headers, lanza un error
      // Esto podría indicar que el usuario no está autenticado
      return throwError(() => new Error('No autorizado: Token de autenticación no disponible.'));
    }

    console.log('OrderService: Enviando pedido al backend:', orderData);
    return this.http.post<any>(this.ordersApiUrl, orderData, { headers }).pipe(
      catchError(this.handleError) // Manejo de errores centralizado
    );
  }

  /**
   * Maneja errores HTTP para las solicitudes de este servicio.
   * @param error El objeto HttpErrorResponse.
   * @returns Un Observable que lanza un error.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Un error desconocido ocurrió.';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente o de la red.
      errorMessage = `Error del cliente o de red: ${error.error.message}`;
    } else {
      // El backend devolvió un código de respuesta de error.
      // El cuerpo de la respuesta puede contener más información.
      console.error(
        `Código de error del backend: ${error.status}, ` +
        `Cuerpo: ${JSON.stringify(error.error)}`
      );
      if (error.status === 401 || error.status === 403) {
        errorMessage = 'Acceso denegado: No tienes permiso o tu sesión ha expirado.';
        // Aquí podrías implementar una lógica para redirigir al login
        // o refrescar el token, si tu aplicación es más compleja.
        // authService.logout() sería ideal aquí, pero necesitas inyectar Router aquí o emitir un evento.
        // Por simplicidad, el componente lo manejará.
      } else if (error.error && error.error.message) {
        errorMessage = `Error del servidor: ${error.error.message}`;
      } else {
        errorMessage = `Error del servidor: ${error.status} ${error.statusText || ''}`;
      }
    }
    // Retorna un observable con un mensaje de error que el componente puede manejar.
    return throwError(() => new Error(errorMessage));
  }

  // Puedes añadir otros métodos para GET, PUT, DELETE de pedidos aquí
  // Ejemplo:
  // getOrderById(id: number): Observable<any> {
  //   const headers = this.authService.getAuthHeaders();
  //   if (!headers) {
  //     return throwError(() => new Error('No autorizado.'));
  //   }
  //   return this.http.get<any>(`${this.ordersApiUrl}/${id}`, { headers }).pipe(
  //     catchError(this.handleError)
  //   );
  // }
}