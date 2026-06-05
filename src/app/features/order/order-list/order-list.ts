import { Component, inject, signal, OnInit } from '@angular/core';
import { Order } from '../order.model';
import { OrderServices } from '../../../core/services/order-services';
import { AuthServices } from '../../../core/services/auth-services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-list',
  imports: [],
  templateUrl: './order-list.html',
  styleUrl: './order-list.css',
})
export class OrderList implements OnInit {

  private readonly orderServices = inject(OrderServices);
  private readonly authServices = inject(AuthServices);
  private readonly router = inject(Router);

  readonly orders = signal<Order[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly message = signal<string | null>(null);

  private readonly currencyFormatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  })

  ngOnInit(): void {
    this.loadOrders();
  }

  get currentUser() {
    return this.authServices.getCurrentUser();
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

  onGoOrderItems(order: Order): void {
    const role = this.currentUser?.role;

    if (role !== 'admin' && role !== 'staff') {
      this.message.set('No tienes permisos para ver el detalle de esta orden');
      return;
    }

    const basePath = role;
    this.router.navigate(['/', basePath, 'articulos-orden', order._id]);
  }

  formatPrice(valor: number): string {
    return this.currencyFormatter.format(valor);
  }

}
