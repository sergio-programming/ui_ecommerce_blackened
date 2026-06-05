import { Component, inject, signal, OnInit } from '@angular/core';
import { OrderServices } from '../../../../core/services/order-services';
import { Order, UserAddress } from '../../../../features/order/order.model';

@Component({
  selector: 'app-addresses',
  imports: [],
  templateUrl: './addresses.html',
  styleUrl: './addresses.css',
})
export class Addresses implements OnInit {

  private readonly orderServices = inject(OrderServices);

  readonly userAddreses = signal<UserAddress[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly message = signal<String | null>(null);

  ngOnInit(): void {
    this.loadUserAddresses()
  }

  async loadUserAddresses(): Promise<void> {
    this.isLoading.set(true);
    this.message.set(null);

    try {
      const orders = await this.orderServices.getOrdersByUser();

      const uniqueAddresses = this.extractUniqueAddresses(orders);
      this.userAddreses.set(uniqueAddresses);

      if (uniqueAddresses.length === 0) {
        this.message.set('Aun no tienes direcciones registradas');
      }
    } catch (error: any) {
      console.error('Error al cargar direcciones:', error);
      this.message.set(error.error?.message || 'No se pudieron cargar las direcciones');
    } finally {
      this.isLoading.set(false);
    }
  }

  private extractUniqueAddresses(orders: Order[]): UserAddress[] {
    const map = new Map<string, UserAddress>();

    orders.forEach((order) => {
      const address: UserAddress = {
        shippingAddress: order.shippingAddress,
        city: order.city
      };

      const key = `${address.shippingAddress}`.toLowerCase();

      if (!map.has(key)) {
        map.set(key, address);
      }
    });

    return Array.from(map.values());
  }




}
