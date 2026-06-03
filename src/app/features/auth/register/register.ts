import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServices } from '../../../core/services/auth-services';
import { UserRegister } from '../../user/user.model';


@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  private readonly authServices = inject(AuthServices);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly isLoading = signal<boolean>(false);
  readonly message = signal<String | null>(null);

  readonly RegisterForm = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  })

  async onSignup(): Promise<void> {
    if (this.RegisterForm.invalid) {
      this.RegisterForm.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.message.set('');

    const data = this.RegisterForm.value as UserRegister;

    try {
      const response = await this.authServices.signup(data);
      this.message.set(response.message);
      this.RegisterForm.reset();
      setTimeout(() => {
        this.router.navigate(['/auth/login']);
      }, 3000);
    } catch (error: any) {
      console.error('Error al registrar el usuario: ', error);
      this.message.set(error.error?.message || 'Error de conexión al servidor');
    } finally {
      this.isLoading.set(false);
    }

  }

  onGoToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

}
