import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserServices } from '../../../core/services/user-services';
import { User, UserCreate, UserUpdate } from '../user.model';

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css',
})
export class UserForm implements OnInit {

  private readonly userServices = inject(UserServices);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);

  readonly userToEdit = signal<User | null>(null);  
  readonly isLoading = signal<boolean>(false);
  readonly message = signal<String | null>(null);

  readonly roleOptions = [
    { label: 'Administrador', value: 'admin' },
    { label: 'Empleado', value: 'staff' },
    { label: 'Usuario', value: 'user' }
  ];

  readonly userForm = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    documentNumber: ['', [Validators.required, Validators.pattern(/^\d{6,10}$/)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    role: ['', [Validators.required]]
  });

  async ngOnInit(): Promise<void> {
    let data = await this.userServices.getUserToEdit();
    const id = this.route.snapshot.paramMap.get('id');

    if (!data && id) {
      try {
        this.isLoading.set(true);
        data = await this.userServices.getUser(id);
      } catch (error) {
        console.error('No se encontro el usuario', error);
        this.message.set('No se encontro el usuario');
      } finally {
        this.isLoading.set(false);
      }
    }

    if (data) {
      this.userToEdit.set(data);
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();

      this.userForm.patchValue({
        fullName: data.fullName,
        email: data.email,
        documentNumber: data.documentNumber,
        role: data.role
      })
    }
  }

  async onSubmit(): Promise<void> {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.message.set(null);
    try {
      if (this.userToEdit()) {
        const { password, ...data } = this.userForm.getRawValue();
        const updatedData: UserUpdate = {
          fullName: data.fullName.trim(),
          email: data.email.trim().toLowerCase(),
          documentNumber: data.documentNumber.trim(),
          role: data.role as UserUpdate['role']
        };
        const response = await this.userServices.updateUser(this.userToEdit()!._id, updatedData);
        this.message.set(response.message);
      } else {
        const rawData = this.userForm.getRawValue();
        const createdData: UserCreate = {
          fullName: rawData.fullName.trim(),
          email: rawData.email.trim().toLowerCase(),
          documentNumber: rawData.documentNumber.trim(),
          password: rawData.password.trim(),
          role: rawData.role as UserCreate['role']
        };
        const response = await this.userServices.createUser(createdData);
        this.message.set(response.message);
      }
      setTimeout(() => this.router.navigate(['/admin/gestion-usuarios']), 2000);
    } catch (error: any) {
      console.error('Ocurrio un error: ', error);
      this.message.set(error.error?.message || 'Error de conexión al servidor');
    } finally {
      if (!this.userToEdit()) {
        this.userForm.reset();
      }
      this.isLoading.set(false);
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/gestion-usuarios']);
  }

}
