import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserServices } from '../../../core/services/user-services';
import { User } from '../user.model';
import { AuthServices } from '../../../core/services/auth-services';

@Component({
  selector: 'app-user-list',
  imports: [],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList implements OnInit {

  private readonly userServices = inject(UserServices);
  private readonly authServices = inject(AuthServices);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  users: User[] | [] = [];
  readonly currentUserEmail = this.authServices.getCurrentUser()?.email;

  readonly isLoading = signal<boolean>(false);
  readonly message = signal<String | null>(null);

  ngOnInit(): void {
    this.loadUsers();
  }


  async loadUsers(): Promise<void> {
    this.isLoading.set(true);
    this.message.set('');
    try {
      const data = await this.userServices.getUsers();
      this.users = data ?? [];
      if (this.users.length === 0) {
        this.message.set('No hay usuarios registrados actualmente');
      }
    } catch (error: any) {
      console.error('Error al cargar los usuarios: ', error);
      this.message.set(error.error?.message || 'Error de conexión al servidor');
    } finally {
      this.isLoading.set(false);
    }
  }

  async onCancelUser(_id: string): Promise<void> {
    if (confirm('¿Estas seguro de cancelar este usuario?')) {
      this.isLoading.set(true);
      this.message.set('');
      try {
        const response = await this.userServices.cancelUser(_id);
        this.message.set(response.message);
        await this.loadUsers();
      } catch (error: any) {
        console.error('Error al cancelar el usuario: ', error);
        this.message.set(error.error?.message || 'Error de conexión al servidor');
      } finally {
        this.isLoading.set(false);
      }
    }
  }

  async onActivateUser(_id: string): Promise<void> {
    if (confirm('¿Estas seguro de activar este usuario?')){
      this.isLoading.set(true);
      this.message.set('');
      try {
        const response = await this.userServices.activateUser(_id);
        this.message.set(response.message);
        this.loadUsers();
      } catch (error: any) {
        console.error('Error al activar el usuario: ', error);
        this.message.set(error.error?.message || 'Error de conexión al servidor');
      } finally {
        this.isLoading.set(false);
      }
    }
  }

  onGoToCreateUserForm(): void {
    this.userServices.setUsertoEdit(null);
    this.router.navigate(['crear'], { relativeTo: this.route });
  }

  onGoToUpdateUserForm(user: User): void {
    this.userServices.setUsertoEdit(user);
    this.router.navigate(['editar', user._id], { relativeTo: this.route });
  }

}
