import { Component, inject, signal, OnInit } from '@angular/core';
import { OrderServices } from '../../../core/services/order-services';
import { Order } from '../order.model';

@Component({
  selector: 'app-order-statistics',
  imports: [],
  templateUrl: './order-statistics.html',
  styleUrl: './order-statistics.css',
})
export class OrderStatistics implements OnInit {

  private readonly orderServices = inject(OrderServices);

  readonly orders = signal<Order[] | []>([]);

  readonly isLoading = signal<boolean>(false);

  private readonly currencyFormatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  });

  ngOnInit(): void {
    this.loadOrderStats();  
  }

  async loadOrderStats(): Promise<void> {
    this.isLoading.set(true);
    try {
      const data = await this.orderServices.getOrders();
      this.orders.set(data);
    } catch (error) {
      console.error('Error al cargar las ordenes: ', error);      
    } finally {
      this.isLoading.set(false);
    }
  }

  getTotalOrders(): number {
    return this.orders().length;
  }

  getTotalOrdersByStatus(status: string): number {
    const ordersByStatus = this.orders().filter((item) => item.status === 'Pendiente');
    return ordersByStatus.length;
  }

  getTotalUnitsSold(): number {
    return this.orders().reduce((total, order) =>
      total + (order.items.reduce((sum, item) => sum + item.quantity, 0))
      ,0)
  }

  getTotalSales(): number {
    return this.orders().reduce((total, order) => total + order.total, 0);
  }

  formatPrice(price: number): string {
    return this.currencyFormatter.format(price);
  }


}
