import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Order, OrderCreate, OrderResponse } from '../../features/order/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderServices {

  private apiUrl = 'http://localhost:3000/api/orders';

  private readonly http = inject(HttpClient);

  async getOrders(): Promise<Order[]> {
    return await firstValueFrom(
      this.http.get<Order[]>(`${this.apiUrl}`)
    );
  }

  async createOrder(data: OrderCreate): Promise<OrderResponse> {
    return await firstValueFrom(
      this.http.post<OrderResponse>(`${this.apiUrl}`, data)
    );
  }

  

}
