import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserServices } from '../../../../core/services/user-services';
import { User } from '../../../../features/user/user.model';

@Component({
  selector: 'app-my-account',
  imports: [],
  templateUrl: './my-account.html',
  styleUrl: './my-account.css',
})
export class MyAccount implements OnInit {

  private readonly userServices = inject(UserServices);
  private readonly router = inject(Router);

  readonly userProfile = signal<User | null>(null);
  readonly isLoading = signal<boolean>(false);

  private readonly dateFormatter = new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })

  ngOnInit(): void {
    this.loadUserProfile();
  }

  async loadUserProfile(): Promise<void> {
    this.isLoading.set(true);
    try {
      const data = await this.userServices.getUserProfile();
      this.userProfile.set(data ?? null);
    } catch (error: any) {
      console.error('Error al obtener la información del usuario: ', error);      
    } finally {
      this.isLoading.set(false);
    }
  }

  formatDate(date?: string): string {
    if (!date) return 'Sin fecha registrada';

    return this.dateFormatter.format(new Date(date));
  }

  onGoToUserEditingForm(): void {
    this.router.navigate(['/user/mi-cuenta/editar-cuenta'])
  }

}
