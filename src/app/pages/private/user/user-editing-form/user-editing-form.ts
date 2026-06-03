import { Component, inject, signal, OnInit } from '@angular/core';
import {  ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserServices } from '../../../../core/services/user-services';
import { User, UserEditInfo } from '../../../../features/user/user.model';

@Component({
  selector: 'app-user-editing-form',
  imports: [ReactiveFormsModule],
  templateUrl: './user-editing-form.html',
  styleUrl: './user-editing-form.css',
})
export class UserEditingForm implements OnInit {

  private readonly userServices = inject(UserServices);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly userProfile = signal<User | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly message = signal<string | null>(null);

  readonly userEditingForm = this.fb.nonNullable.group({
    fullName: ['', [Validators.minLength(3)]],
    email: ['', [Validators.email]],
    password: ['', [Validators.minLength(8)]],
    confirmPassword: ['', [Validators.minLength(8)]]
  })

  ngOnInit(): void {
    this.loadUserProfile();
  }

  async loadUserProfile(): Promise<void> {
    this.isLoading.set(true);
    try {
      const data = await this.userServices.getUserProfile();
      this.userProfile.set(data ?? null);
      this.userEditingForm.patchValue({
        fullName: data?.fullName ?? '',
        email: data?.email ?? '',
      });
    } catch (error: any) {
      console.error('Error al obtener la información del usuario: ', error);      
    } finally {
      this.isLoading.set(false);
    }
  }

  async onSubmit(): Promise<void> {
    this.message.set(null);

    if (this.userEditingForm.invalid) {
      this.userEditingForm.markAllAsTouched();
      this.message.set('Revisa los campos antes de guardar los cambios.');
      return;
    }

    const { fullName, email, password, confirmPassword } = this.userEditingForm.getRawValue();

    if (password && password !== confirmPassword) {
      this.userEditingForm.get('confirmPassword')?.markAsTouched();
      this.message.set('Las contrasenas deben coincidir.');
      return;
    }

    const dataToUpdate: UserEditInfo = {
      fullName,
      email,
    };

    if (password) {
      dataToUpdate.password = password;
      dataToUpdate.confirmPassword = confirmPassword;
    }

    this.isLoading.set(true);
    try {
      await this.userServices.editUserInfo(dataToUpdate);
      this.router.navigate(['/user/mi-cuenta']);
    } catch (error: any) {
      console.error('Error al actualizar la informacion del usuario: ', error);
      this.message.set(error?.error?.message ?? 'No se pudo actualizar la informacion de tu cuenta.');
    } finally {
      this.isLoading.set(false);
    }
  }



}
