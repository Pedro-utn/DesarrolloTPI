import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    console.log('AuthGuard: Acceso permitido por AuthService.');
    return true; // Si AuthService dice que está loggeado, permite el acceso
  } else {
    // Si no está autenticado, redirige al login y niega el acceso
    console.warn('AuthGuard: Acceso denegado. Redirigiendo a /login.');
    router.navigate(['/login']);
    return false;
  }
};