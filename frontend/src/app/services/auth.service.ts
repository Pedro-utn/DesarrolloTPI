// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  public isLoggedIn$: Observable<boolean> = this._isLoggedIn.asObservable();

  // URL base de tu microservicio NestJS (asegúrate de que sea la correcta)
  // Si tu microservicio corre en localhost:3000, sería algo así:
  private apiUrl = 'http://localhost:3001'; // Ajusta esto a la URL real de tu backend

  constructor(private router: Router, private http: HttpClient) {
    const token = localStorage.getItem('accessToken');
    if (token) {
      this._isLoggedIn.next(true);
    }
  }

  async login(username: string, password: string): Promise<boolean> {
    console.log('AuthService: Intentando login para:', username);

    const loginData = { email: username, password: password }; // Tu backend espera 'email'

    return new Promise((resolve) => {
      this.http.post<any>(`${this.apiUrl}/login`, loginData)
        .pipe(
          tap(response => {
            // Si el backend devuelve accessToken y refreshToken
            if (response && response.accessToken && response.refreshToken) {
              localStorage.setItem('accessToken', response.accessToken);
              localStorage.setItem('refreshToken', response.refreshToken); // Guardar refresh token también
              this._isLoggedIn.next(true);
              console.log('AuthService: Login exitoso. Tokens guardados.');
              resolve(true);
            } else {
              // Esto ocurriría si el backend devuelve un 200 OK pero sin los tokens esperados
              console.warn('AuthService: Login exitoso, pero no se recibieron tokens esperados.');
              this._isLoggedIn.next(false);
              resolve(false);
            }
          }),
          catchError((error: HttpErrorResponse) => {
            console.error('AuthService: Error en el login:', error);
            this._isLoggedIn.next(false);
            // Puedes manejar diferentes códigos de error HTTP aquí
            if (error.status === 401) { // Unauthorized (credenciales incorrectas)
              console.log('AuthService: Credenciales incorrectas.');
              // Podrías lanzar un error específico o simplemente resolver a false
            } else if (error.status >= 500) { // Errores del servidor
              console.log('AuthService: Error del servidor.');
            } else { // Otros errores
              console.log('AuthService: Error desconocido en el login.');
            }
            resolve(false); // Siempre resuelve la promesa a false en caso de error
            return throwError(() => new Error('Login fallido')); // Propaga el error para que el componente pueda manejarlo si lo desea
          })
        )
        .subscribe(); // Necesario para que el Observable se ejecute
    });
  }

  async register(email: string, password: string): Promise<boolean> {
    console.log('AuthService: Intentando registro para:', email);
    const registerData = { email: email, password: password };

    return new Promise((resolve) => {
      this.http.post<any>(`${this.apiUrl}/register`, registerData)
        .pipe(
          tap(response => {
            console.log('AuthService: Registro exitoso.', response);
            // Aquí no necesariamente inicias sesión, solo confirmas el registro
            resolve(true);
          }),
          catchError((error: HttpErrorResponse) => {
            console.error('AuthService: Error en el registro:', error);
            resolve(false);
            return throwError(() => new Error('Registro fallido'));
          })
        )
        .subscribe();
    });
  }

  logout(): void {
    console.log('AuthService: Cerrando sesión');
    localStorage.removeItem('accessToken'); // Eliminar accessToken
    localStorage.removeItem('refreshToken'); // Eliminar refreshToken
    this._isLoggedIn.next(false);
    this.router.navigate(['/login']);
  }

  /**
   * Obtiene el token de acceso (accessToken) almacenado en el localStorage.
   * @returns El token de acceso como string, o null si no se encuentra.
   */
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  /**
   * Retorna un objeto HttpHeaders con el token de autenticación para solicitudes a la API.
   * Incluye el 'Content-Type' como 'application/json' y el 'Authorization' como 'Bearer Token'.
   * @returns HttpHeaders | null - Los headers configurados, o null si no hay un token de acceso disponible.
   */
  getAuthHeaders(): HttpHeaders | null {
    const token = this.getAccessToken(); // Llama al método para obtener el token
    if (token) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Adjunta el token con el prefijo 'Bearer'
      });
    }
    return null; // Si no hay token, retorna null
  }

  isAuthenticated(): boolean {
    const accessToken = localStorage.getItem('accessToken');
    // En una app real, también deberías decodificar el token para verificar su expiración
    // o hacer una llamada al backend para validar el token si es necesario
    return !!accessToken; // Devuelve true si el token existe, false si no
  }
}
