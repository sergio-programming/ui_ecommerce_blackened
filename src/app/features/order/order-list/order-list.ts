import { Component, inject, signal, OnInit } from '@angular/core';
import { Order } from '../order.model';
import { OrderServices } from '../../../core/services/order-services';

@Component({
  selector: 'app-order-list',
  imports: [],
  templateUrl: './order-list.html',
  styleUrl: './order-list.css',
})
export class OrderList implements OnInit {

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
    this.loadOrders();
  }

  async loadOrders(): Promise<void> {
    this.isLoading.set(true);
    this.message.set('');

    try {
      const data = await this.orderServices.getOrders();
      this.orders.set(data ?? []);
      if (this.orders().length === 0) {
        this.message.set('No hay ordenes generadas actualmente');
      }
    } catch (error: any) {
      console.error('Error al cargar las ordenes: ', error);
      this.message.set(error.error?.message || 'Error de conexión al servidor');
    } finally {
      this.isLoading.set(false);
    }
  }

  formatPrice(valor: number): string {
    return this.currencyFormatter.format(valor);
  }

}
