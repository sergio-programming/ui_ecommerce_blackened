import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Checkout, CheckoutCreate, CheckoutResponse, CheckoutUpdate } from '../../features/checkout/checkout.model';

@Injectable({
  providedIn: 'root',
})
export class CheckoutServices {

  private apiUrl = 'http://localhost:3000/api/checkouts';

  private readonly http = inject(HttpClient);

  async getCheckoutByUser(): Promise<Checkout> {
    return await firstValueFrom(
      this.http.get<Checkout>(`${this.apiUrl}/user`)
    );
  }

  async createCheckout(data: CheckoutCreate): Promise<CheckoutResponse> {
    return await firstValueFrom(
      this.http.post<CheckoutResponse>(`${this.apiUrl}`, data)
    );
  }

  async updateCheckout(_id: string, cartId: string, data: CheckoutUpdate): Promise<CheckoutResponse> {
    return await firstValueFrom(
      this.http.put<CheckoutResponse>(`${this.apiUrl}/${_id}/cart/${cartId}`, data)
    );
  }

  async deleteCheckout(_id: string): Promise<CheckoutResponse> {
    return await firstValueFrom(
      this.http.delete<CheckoutResponse>(`${this.apiUrl}/${_id}`)
    );
  }

}
