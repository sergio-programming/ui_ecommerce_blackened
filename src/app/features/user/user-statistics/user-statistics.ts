import { Component, inject, signal, OnInit } from '@angular/core';
import { UserServices } from '../../../core/services/user-services';
import { User } from '../user.model';

@Component({
  selector: 'app-user-statistics',
  imports: [],
  templateUrl: './user-statistics.html',
  styleUrl: './user-statistics.css',
})
export class UserStatistics implements OnInit {

  private readonly userServices = inject(UserServices);

  readonly adminUsers = signal<User[]>([]);
  readonly staffUsers = signal<User[]>([]);
  readonly normalUsers = signal<User[]>([]);

  readonly isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.loadUserStats();
  }

  async loadUserStats(): Promise<void> {
    this.isLoading.set(true)
    try {
      const data = await this.userServices.getUsers();
      const users = data ?? [];
      this.adminUsers.set(users.filter(user => user.role === 'admin'));
      this.staffUsers.set(users.filter(user => user.role === 'staff'));
      this.normalUsers.set(users.filter(user => user.role === 'user'));
    } catch (error) {
      console.error('Error al cargar los usuarios: ', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  getTotalUsers(): number {
    return this.adminUsers().length + this.staffUsers().length + this.normalUsers().length;
  }
  

}
