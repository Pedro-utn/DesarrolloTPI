// src/app/services/order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service'; 
import { Order, PaginationQueryParams, NewOrderRequest } from '../interfaces/order.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersApiUrl = 'http://localhost:3000/order';

  constructor(
    private http: HttpClient,
    private authService: AuthService
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
      return throwError(() => new Error('No autorizado: Token de autenticación no disponible.'));
    }

    console.log('OrderService: Enviando pedido al backend:', orderData);
    return this.http.post<any>(this.ordersApiUrl, orderData, { headers }).pipe(
      catchError(this.handleError) // Manejo de errores centralizado
    );
  }

  /**
   * Obtiene una lista paginada de pedidos desde el backend.
   * Envía 'page' y 'quantity' como query parameters.
   * Incluye el token de autorización en los headers.
   * @param params Un objeto con los parámetros de paginación (page, quantity).
   * @returns Un Observable con el ARRAY de pedidos (Order[]) que devuelve el backend.
   */
  getOrders(params: PaginationQueryParams): Observable<Order[]> {
    let httpParams = new HttpParams();

    // Añade el parámetro 'page' si está definido en los parámetros que recibimos
    if (params.page !== undefined && params.page !== null) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    // Añade el parámetro 'quantity' si está definido en los parámetros que recibimos
    if (params.quantity !== undefined && params.quantity !== null) {
      httpParams = httpParams.set('quantity', params.quantity.toString());
    }

    const headers = this.authService.getAuthHeaders(); // Obtiene los headers de autorización para la autenticación

    if (!headers) {
      // Si no hay token, lanza un error. La API de GET también requiere autenticación.
      return throwError(() => new Error('No autorizado: Token de autenticación no disponible para obtener pedidos.'));
    }

    console.log('OrderService: Obteniendo pedidos con parámetros:', httpParams.toString());
    // Hace la petición GET, esperando un Order[] como respuesta.
    // Pasamos los parámetros HTTP y los headers de autenticación.
    return this.http.get<Order[]>(this.ordersApiUrl, { params: httpParams, headers: headers }).pipe(
      catchError(this.handleError)
    );
  }







  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  // --- CAMBIO OPCIONAL AQUÍ: Método para eliminar un pedido (si lo usas en la tabla) ---
  /**
   * Envía una solicitud para eliminar un pedido específico.
   * @param orderId El ID del pedido a eliminar.
   * @returns Un Observable con la respuesta del backend.
   */
  deleteOrder(orderId: number): Observable<any> {
    const headers = this.authService.getAuthHeaders();

    if (!headers) {
      return throwError(() => new Error('No autorizado: Token de autenticación no disponible para eliminar pedido.'));
    }

    console.log(`OrderService: Eliminando pedido con ID: ${orderId}`);
    return this.http.delete<any>(`${this.ordersApiUrl}/${orderId}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  // --- FIN CAMBIO OPCIONAL ---
  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX







  
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
}