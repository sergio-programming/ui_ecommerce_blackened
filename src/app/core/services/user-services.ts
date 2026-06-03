import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, UserCreate, UserEditInfo, UserResponse, UserUpdate } from '../../features/user/user.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserServices {

  private apiUrl = 'http://localhost:3000/api/users';

  private readonly http = inject(HttpClient);

  private readonly userToEdit = signal<User | null>(null);

  async getUsers(): Promise<User[]> {
    return await firstValueFrom(
      this.http.get<User[]>(`${this.apiUrl}`)
    );
  }

  async getUser(_id: string): Promise<User> {
    return await firstValueFrom(
      this.http.get<User>(`${this.apiUrl}/${_id}`)
    );
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return firstValueFrom(
      this.http.get<User[]>(`${this.apiUrl}/role/${role}`)
    );
  }

  async getUserProfile(): Promise<User> {
    return firstValueFrom(
      this.http.get<User>(`${this.apiUrl}/me`)
    );
  }

  async createUser(data: UserCreate): Promise<UserResponse> {
    return await firstValueFrom(
      this.http.post<UserResponse>(`${this.apiUrl}`, data)
    );
  }

  async updateUser(_id: string, data: UserUpdate): Promise<UserResponse> {
    return await firstValueFrom(
      this.http.put<UserResponse>(`${this.apiUrl}/${_id}`, data)
    );
  }

  async editUserInfo(data: UserEditInfo): Promise<UserResponse> {
    return await firstValueFrom(
      this.http.put<UserResponse>(`${this.apiUrl}/me`, data)
    );
  }

  async deleteUser(_id: string): Promise<UserResponse> {
    return await firstValueFrom(
      this.http.delete<UserResponse>(`${this.apiUrl}/${_id}`)
    );
  }

  async activateUser(_id: string): Promise<UserResponse> {
    return await firstValueFrom(
      this.http.patch<UserResponse>(`${this.apiUrl}/${_id}/activate`, null)
    );
  }

  async cancelUser(_id: string): Promise<UserResponse> {
    return await firstValueFrom(
      this.http.patch<UserResponse>(`${this.apiUrl}/${_id}/cancel`, null)
    );
  }

  setUsertoEdit(user: User | null): void {
    this.userToEdit.set(user);
  }

  getUserToEdit(): User | null {
    return this.userToEdit() ?? null;
  }

}
