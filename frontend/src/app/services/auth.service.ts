import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { MeResponse } from '../interfaces/user.interface'; 

// Lógica para iniciar sesión y registrar usuarios
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // BehaviorSubject para emitir el estado de autenticación (true si logueado, false si no)
  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  // Observable para que los componentes puedan suscribirse al estado de autenticación
  public isLoggedIn$: Observable<boolean> = this._isLoggedIn.asObservable();

  // URL de la API del backend
  private apiUrl = 'http://localhost:3001';

  constructor(
    private router: Router, // Servicio de Router de Angular para navegación
    private http: HttpClient // Cliente HTTP de Angular para hacer peticiones al backend
  ){ 
    // Al inicializar el servicio, comprueba si existe un token de acceso en el localStorage
    // para determinar el estado inicial de autenticación
    const token = localStorage.getItem('accessToken');
    if (token) {
      this._isLoggedIn.next(true); // Si hay token, el usuario se considera logueado
    }
  }

  // Método para iniciar sesión
  // Almacena los tokens JWT recibidos en el localStorage si el mismo es exitoso
  async login(email: string, password: string): Promise<boolean> {
    const loginData = { email: email, password: password }; 

    return new Promise((resolve) => {
      this.http.post<any>(`${this.apiUrl}/login`, loginData)
        .pipe(
          tap(response => {
            // Si la respuesta contiene los tokens, los guarda y actualiza el estado de autenticación
            if (response && response.accessToken && response.refreshToken) {
              localStorage.setItem('accessToken', response.accessToken);
              localStorage.setItem('refreshToken', response.refreshToken);
              this._isLoggedIn.next(true);

              // Se hace una segunda petición al endpoint /me para guardar los datos del usuario
              this.getMe().subscribe({
                next: (userInfo) => {
                  localStorage.setItem('userEmail', userInfo.email);
                  localStorage.setItem('userId', userInfo.id.toString());
                },
                error: (err) => {
                  console.error('No se pudo obtener información del usuario:', err);
                }
              });

              resolve(true);

            } else {
              // Si no se reciben los tokens esperados, pero la llamada fue exitosa (código 200)
              this._isLoggedIn.next(false);
              resolve(false);
            }
          }),

          // Captura y maneja cualquier error HTTP durante la petición de login
          catchError((error: HttpErrorResponse) => {
            console.error('AuthService: Error en el login:', error);
            this._isLoggedIn.next(false); // Marca como no logueado en caso de error
            resolve(false); // Resuelve la promesa con false en caso de error
            // Propaga el error para que pueda ser manejado por el componente si es necesario
            return throwError(() => new Error('Login fallido'));
          })
        )
        .subscribe(); // Se suscribe al Observable para que la petición se ejecute
    });
  }

  // Método para registrar un nuevo usuario
  async register(email: string, password: string): Promise<boolean> {
    const registerData = { email: email, password: password };

    return new Promise((resolve) => {
      this.http.post<any>(`${this.apiUrl}/register`, registerData)
        .pipe(
          tap(response => {
            console.log('AuthService: Registro exitoso.', response);
            resolve(true);
          }),
          // Captura y maneja cualquier error HTTP durante la petición de registro
          catchError((error: HttpErrorResponse) => {
            console.error('AuthService: Error en el registro:', error);
            resolve(false); // Resuelve la promesa con false en caso de error
            // Propaga el error para que pueda ser manejado por el componente si es necesario
            return throwError(() => new Error('Registro fallido'));
          })
        )
        .subscribe(); // Se suscribe al Observable para que la petición se ejecute
    });
  }

  // Método para obtener la información del usuario logueado
  getMe(): Observable<MeResponse> {
    const headers = this.getAuthHeaders(); // Obtiene los headers de autorización
    // Si no hay token, lanza un error inmediatamente
    if (!headers) {
      return throwError(() => new Error('No autorizado: Token de autenticación no disponible.'));
    }
    
    // Realiza la petición GET al endpoint '/me' con los headers de autenticación
    return this.http.get<MeResponse>(`${this.apiUrl}/me`, { headers }).pipe(
      catchError(this.handleError) // Captura y maneja cualquier error HTTP
    );
  }

  // Método para cerrar sesión
  // Elimina los tokens del localStorage y actualiza el estado de autenticación
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    this._isLoggedIn.next(false); // Marca como no logueado
    this.router.navigate(['/login']); // Redirige a la página de login
  }

  // Obtiene el token de acceso del localStorage
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // Construye los headers de autorización para las peticiones HTTP
  getAuthHeaders(): HttpHeaders | null {
    const token = this.getAccessToken();
    if (token) {
      return new HttpHeaders({
        'Content-Type': 'application/json', // Tipo de contenido común para APIs REST
        'Authorization': `Bearer ${token}` // Formato estándar para tokens Bearer
      });
    }
    return null; // Si no hay token, retorna null
  }

  // Método para verificar si el usuario está autenticado
  // Comprueba si hay un token de acceso en el localStorage
  isAuthenticated(): boolean {
    const accessToken = localStorage.getItem('accessToken');
    return !!accessToken; // Convierte la presencia del token a un booleano
  }

  // Maneja errores HTTP de manera centralizada
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
