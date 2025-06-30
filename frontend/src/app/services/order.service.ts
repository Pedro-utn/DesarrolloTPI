import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service'; 
import { Order, PaginationQueryParams, NewOrderRequest, OrderUpdateRequest } from '../interfaces/order.interface';

// Este servicio se encarga de interactuar con la API de pedidos
// Proporciona métodos para crear, obtener, actualizar y eliminar pedidos

@Injectable({
  providedIn: 'root' // Esto asegura que el servicio esté disponible en toda la aplicación
})
export class OrderService {
  // URL base de la API de pedidos
  private ordersApiUrl = 'http://localhost:3000/order';

  constructor(
    private http: HttpClient, // Cliente HTTP para hacer peticiones a la API
    private authService: AuthService // Servicio de autenticación para obtener headers con el token JWT
  ) { }

  // Solicitud para crear un nuevo pedido

  createOrder(orderData: NewOrderRequest): Observable<any> {
    const headers = this.authService.getAuthHeaders(); // Obtiene los headers de autorización (con el token JWT)

    if (!headers) {
      // Si no hay token disponible, se asume que el usuario no está autenticado
      return throwError(() => new Error('No autorizado: Token de autenticación no disponible.'));
    }

    // Realiza la petición POST a la API de pedidos con los datos y headers de autenticación
    return this.http.post<any>(this.ordersApiUrl, orderData, { headers }).pipe(
      catchError(this.handleError) // Captura y maneja errores HTTP
    );
  }

  // Obtiene una lista de pedidos desde el backend, con soporte para paginación!!!

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

    // Hace la petición GET a la API de pedidos con los parámetros y headers
    return this.http.get<Order[]>(this.ordersApiUrl, { params: httpParams, headers: headers }).pipe(
      catchError(this.handleError) // Captura y maneja errores HTTP
    );
  }

  // Obetiene los detalles de un pedido específico por su ID

  getOrderById(id: number): Observable<Order> {
    const headers = this.authService.getAuthHeaders();

    if (!headers) {
      return throwError(() => new Error('No autorizado: Token de autenticación no disponible.'));
    }
    const url = `${this.ordersApiUrl}/${id}`; // Construye la URL específica para el pedido
    
    // Realiza la petición GET al endpoint específico del pedido por ID
    return this.http.get<Order>(url, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Envía una solicitud para actualizar un pedido existente

  updateOrder(id: number, updateData: OrderUpdateRequest): Observable<Order> {
    const headers = this.authService.getAuthHeaders();

    if (!headers) {
      return throwError(() => new Error('No autorizado: Token de autenticación no disponible.'));
    }
    const url = `${this.ordersApiUrl}/${id}`; // Construye la URL específica para el pedido

    // Realiza la petición PUT a la API para actualizar el pedido.
    return this.http.put<Order>(url, updateData, { headers }).pipe(
      catchError(this.handleError) // Captura y maneja errores HTTP
    );
  }

  // Envía una solicitud para eliminar un pedido por su ID

  deleteOrder(orderId: number): Observable<any> {
    const headers = this.authService.getAuthHeaders();

    if (!headers) {
      return throwError(() => new Error('No autorizado: Token de autenticación no disponible para eliminar pedido.'));
    }

    // Realiza la petición DELETE a la API para eliminar el pedido por ID
    return this.http.delete<any>(`${this.ordersApiUrl}/${orderId}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Maneja errores HTTP de manera centralizada
  // Analiza el tipo de error (cliente/red o servidor) y retorna un mensaje adecuado

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Un error desconocido ocurrió.'; // Mensaje de error por defecto
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente o un error de red
      errorMessage = `Error del cliente o de red: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      if (error.status === 401 || error.status === 403) {
        errorMessage = 'Acceso denegado: No tienes permiso o tu sesión ha expirado.';
      } else if (error.error && error.error.message) {
        // Si el backend envía un mensaje de error específico en el cuerpo de la respuesta
        errorMessage = `Error del servidor: ${error.error.message}`;
      } else {
        // Mensaje de error genérico si no hay un mensaje específico del backend
        errorMessage = `Error del servidor: ${error.status} ${error.statusText || ''}`;
      }
    }
    // Retorna un observable con un nuevo objeto Error que contiene el mensaje final
    return throwError(() => new Error(errorMessage));
  }
}