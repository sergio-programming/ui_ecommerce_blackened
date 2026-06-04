import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cart, CartCreate, CartItemUpdate, CartResponse, CartUpdate } from '../../features/cart/cart.model';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class CartServices {

  private readonly apiUrl = `${API_BASE_URL}/carts`;

  private readonly http = inject(HttpClient);

  async getCarts(): Promise<Cart[]> {
    return await firstValueFrom(
      this.http.get<Cart[]>(`${this.apiUrl}`)
    );
  }

  async getCart(_id: string): Promise<Cart> {
    return await firstValueFrom(
      this.http.get<Cart>(`${this.apiUrl}/${_id}`)
    );
  }

  async getCartByUser(): Promise<Cart> {
    return await firstValueFrom(
      this.http.get<Cart>(`${this.apiUrl}/user`)
    );
  }

  async createCart(data: CartCreate): Promise<CartResponse> {
    return await firstValueFrom(
      this.http.post<CartResponse>(`${this.apiUrl}/`, data)
    );
  }

  async updateCart(_id: string, data: CartUpdate): Promise<CartResponse> {
    return await firstValueFrom(
      this.http.put<CartResponse>(`${this.apiUrl}/${_id}`, data)
    );
  }

  async deleteCart(_id: string): Promise<CartResponse> {
    return await firstValueFrom(
      this.http.delete<CartResponse>(`${this.apiUrl}/${_id}`)
    );
  }

  async updateCartItem(_id: string, itemId: string, data: CartItemUpdate): Promise<CartResponse> {
    return await firstValueFrom(
      this.http.put<CartResponse>(`${this.apiUrl}/${_id}/items/${itemId}`, data)
    )
  }

  async deleteCartItem(_id: string, itemId: string): Promise<CartResponse> {
    return await firstValueFrom(
      this.http.delete<CartResponse>(`${this.apiUrl}/${_id}/items/${itemId}`)
    );
  }

}
