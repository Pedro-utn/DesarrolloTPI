import { Component, OnInit } from '@angular/core'; // Importa OnInit
import { CommonModule } from '@angular/common';
// Importa las clases y módulos necesarios para Formularios Reactivos
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  //Importa ReactiveFormsModule
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit { // Implementa OnInit
  loginForm!: FormGroup; //Declara el FormGroup
  errorMessage: string = '';

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    // Inicializa FormGroup con los FormControl y sus validadores
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required), // Campo 'username' requerido
      password: new FormControl('', Validators.required)  // Campo 'password' requerido
    });
  }

  // Este es el método que se llamará cuando se envíe el formulario
  async onSubmit() {
    this.errorMessage = ''; // Limpia cualquier mensaje de error anterior

    // Verifica si el formulario es válido antes de procesar
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value; // Obtiene los valores del formulario

      try {
        const success = await this.authService.login(username, password);
        if (success) {
          this.router.navigate(['/home']);
        } else {
          this.errorMessage = 'Credenciales incorrectas. Inténtalo de nuevo.';
        }
      } catch (error) {
        this.errorMessage = 'Hubo un error al intentar iniciar sesión.';
        console.error('Login error in component:', error);
      }
    } else {
      // Si el formulario no es válido, puedes mostrar un mensaje genérico
      this.errorMessage = 'Por favor, completa todos los campos requeridos.';
      // Opcional: Marcar todos los controles como 'touched' para que se muestren los mensajes de error
      this.loginForm.markAllAsTouched();
    }
  }

  // Método auxiliar para acceder fácilmente a los controles del formulario en la plantilla
  get formControls() {
    return this.loginForm.controls;
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}