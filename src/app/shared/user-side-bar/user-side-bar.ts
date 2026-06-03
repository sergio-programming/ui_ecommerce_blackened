import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserServices } from '../../core/services/user-services';
import { User } from '../../features/user/user.model';

@Component({
  selector: 'app-user-side-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './user-side-bar.html',
  styleUrl: './user-side-bar.css',
})
export class UserSideBar implements OnInit {

  private readonly userServices = inject(UserServices);
  readonly userProfile = signal<User | null>(null);
  readonly isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.loadUserProfile();
  }

  async loadUserProfile(): Promise<void> {
    this.isLoading.set(true);
    try {
      const data = await this.userServices.getUserProfile();
      this.userProfile.set(data ?? null);
    } catch (error: any) {
      console.error('Error al obtener la informacion del usuario: ', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  get links() {
    return [
      { label: 'Informacion de la cuenta', path: '/user/mi-cuenta', icon: 'fa-solid fa-user' },
      { label: 'Direcciones registradas', path: '/user/mi-cuenta/direcciones', icon: 'fa-solid fa-location-dot' },
      { label: 'Historial de ordenes', path: '/user/mi-cuenta/historial-ordenes', icon: 'fa-solid fa-box-open' }
    ]
  }
}
