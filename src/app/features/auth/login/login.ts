import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginPayload } from '../auth.model';
import { AuthServices } from '../../../core/services/auth-services';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private readonly authServices = inject(AuthServices);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly isLoading = signal<boolean>(false);
  readonly message = signal<string | null>(null);

  readonly LoginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  async onLogin(): Promise<void> {
    if (this.LoginForm.invalid) {
      this.LoginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.message.set('');

    const payload = this.LoginForm.value as LoginPayload;

    try {
      await this.authServices.login(payload);
      const role = this.authServices.getCurrentUser()?.role;
      let path = '';

      if (role === 'admin') {
        path = '/admin/dashboard';
      } else if (role === 'staff') {
        path = '/staff/dashboard';
      } else {
        path = '/user/mi-cuenta';
      }

      await this.router.navigate([path], { replaceUrl: true });
    } catch (error: any) {
      console.error('Error al iniciar sesión: ', error);
      this.message.set(error.error?.message || 'Credenciales inválidas');
      this.LoginForm.patchValue({ password: '' });
      this.LoginForm.get('password')?.markAsUntouched();
    } finally {
      this.isLoading.set(false);
    }
  }

  onGoToRegister(): void {
    this.router.navigate(['/auth/register']);
  }

}
