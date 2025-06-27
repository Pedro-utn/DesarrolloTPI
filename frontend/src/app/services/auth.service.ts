import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs'; // Necesario para el estado de isLoggedIn$

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  public isLoggedIn$: Observable<boolean> = this._isLoggedIn.asObservable();

  constructor(private router: Router) {
    // Al iniciar, verifica si hay un token simulado para restaurar la sesión
    const token = localStorage.getItem('authToken');
    if (token) {
      this._isLoggedIn.next(true);
    }
  }

  async login(username: string, password: string): Promise<boolean> {
    console.log('AuthService: Simulando intento de login para:', username);
    // SIMULACIÓN: Siempre devuelve true después de un breve retraso
    return new Promise(resolve => {
      setTimeout(() => {
        // Ejemplo de simulación con credenciales fijas
        if (username === 'test@example.com' && password === 'password') { // Usa credenciales de prueba
            localStorage.setItem('authToken', 'fake_jwt_token_123'); // Guarda un token simulado
            this._isLoggedIn.next(true);
            console.log('AuthService: Login simulado exitoso.');
            resolve(true);
        } else {
            console.log('AuthService: Login simulado fallido (credenciales incorrectas).');
            this._isLoggedIn.next(false);
            resolve(false);
        }
      }, 500); // Simula un retraso de red
    });
  }

  async register(email: string, password: string): Promise<boolean> {
    console.log('AuthService: Simulando intento de registro para:', email);
    // SIMULACIÓN: Siempre devuelve true después de un breve retraso
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('AuthService: Registro simulado exitoso.');
        resolve(true);
      }, 500);
    });
  }

  logout(): void {
    console.log('AuthService: Logout simulado');
    localStorage.removeItem('authToken'); // Eliminar token simulado
    this._isLoggedIn.next(false);
    this.router.navigate(['/login']); // Redirige al login
  }

  isAuthenticated(): boolean {
    // En una app real, acá también se podría validar si el token no ha expirado
    const token = localStorage.getItem('authToken');
    const authStatus = !!token; // Devuelve true si el token existe, false si no
    return authStatus;
  }
}