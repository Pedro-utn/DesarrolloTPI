import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// Importa AbstractControl y ValidatorFn
import { FormGroup, FormControl, Validators, ReactiveFormsModule, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage: string = '';

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', Validators.required) // Mantén Validators.required aquí
    });

    // Aplica el validador personalizado como segundo argumento de setValidators
    this.registerForm.controls['confirmPassword'].setValidators([
      Validators.required, // Primero el validador de requerido
      this.matchPasswordsValidator('password', 'confirmPassword') // validador personalizado
    ]);

    // Actualizar validador de confirmPassword cuando cambia password
    this.registerForm.controls['password'].valueChanges.subscribe(() => {
      this.registerForm.controls['confirmPassword'].updateValueAndValidity();
    });
  }

  // Validador personalizado ajustado para AbstractControl y tipo ValidatorFn
  private matchPasswordsValidator(passwordControlName: string, confirmPasswordControlName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const passwordControl = control.root.get(passwordControlName);
      const confirmPasswordControl = control.root.get(confirmPasswordControlName);

      if (!passwordControl || !confirmPasswordControl) {
        return null; // Si no existen, no podemos validar
      }

      // Si el control de confirmación no tiene valor, o las contraseñas coinciden, no hay error
      if (confirmPasswordControl.value === '' || passwordControl.value === confirmPasswordControl.value) {
        return null;
      }

      // Si las contraseñas no coinciden, devuelve el error
      return { passwordsNotMatching: true };
    };
  }


  async onSubmit() {
    this.errorMessage = '';

    if (this.registerForm.valid) {
      const { email, password } = this.registerForm.value;

      try {
        const success = await this.authService.register(email, password);
        if (success) {
          alert('Usuario registrado con éxito (simulado)!');
          this.router.navigate(['/login']);
        } else {
          this.errorMessage = 'Error en el registro. Inténtalo de nuevo.';
        }
      } catch (error) {
        this.errorMessage = 'Hubo un error al intentar registrarse.';
        console.error('Register error in component:', error);
      }
    } else {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
      this.registerForm.markAllAsTouched();
    }
  }

  get formControls() {
    return this.registerForm.controls;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}