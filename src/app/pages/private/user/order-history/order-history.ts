import { Component, inject, signal, OnInit } from '@angular/core';
import { OrderServices } from '../../../../core/services/order-services';
import { Order } from '../../../../features/order/order.model';

@Component({
  selector: 'app-order-history',
  imports: [],
  templateUrl: './order-history.html',
  styleUrl: './order-history.css',
})
export class OrderHistory implements OnInit {

  private readonly orderServices = inject(OrderServices);

  readonly orders = signal<Order[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly message = signal<String | null>(null);

  private readonly currencyFormatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  })

  ngOnInit(): void {
    this.loadMyOrders();
  }

  async loadMyOrders(): Promise<void> {
    this.isLoading.set(true);
    this.message.set('');

    try {
      const data = await this.orderServices.getOrdersByUser();
      this.orders.set(data ?? []);
      if (this.orders().length === 0) {
        this.message.set('No tienes ordenes registradas actualmente');
      }
    } catch (error: any) {
      console.error('Error al cargar las ordenes del usuario: ', error);
      this.message.set(error.error?.message || 'Error de conexión al servidor');
    } finally {
      this.isLoading.set(false);
    }
  } 

  formatPrice(value?: number): string {
    return this.currencyFormatter.format(value ?? 0);
  }

}
