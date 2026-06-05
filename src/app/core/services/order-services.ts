import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Order, OrderCreate, OrderResponse, OrderUpdate } from '../../features/order/order.model';
import { API_BASE_URL } from '../config/api.config';


@Injectable({
  providedIn: 'root',
})
export class OrderServices {

  private readonly apiUrl = `${API_BASE_URL}/orders`;

  private readonly http = inject(HttpClient);

  async getOrders(): Promise<Order[]> {
    return await firstValueFrom(
      this.http.get<Order[]>(`${this.apiUrl}`)
    );
  }

  async getOrder(_id: string): Promise<Order> {
    return await firstValueFrom(
      this.http.get<Order>(`${this.apiUrl}/${_id}`)
    );
  }

  async getOrdersByUser(): Promise<Order[]> {
    return await firstValueFrom(
      this.http.get<Order[]>(`${this.apiUrl}/user`)
    );
  }

  async createOrder(data: OrderCreate): Promise<OrderResponse> {
    return await firstValueFrom(
      this.http.post<OrderResponse>(`${this.apiUrl}`, data)
    );
  }

  async updateOrder(_id: string, data: OrderUpdate): Promise<OrderResponse> {
    return await firstValueFrom(
      this.http.put<OrderResponse>(`${this.apiUrl}/${_id}`, data)
    );
  }

  async deleteOrder(_id: string): Promise<OrderResponse> {
    return await firstValueFrom(
      this.http.delete<OrderResponse>(`${this.apiUrl}/${_id}`)
    );
  }
    

}
