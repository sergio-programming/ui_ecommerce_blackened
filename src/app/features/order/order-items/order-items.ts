import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderServices } from '../../../core/services/order-services';
import { AuthServices } from '../../../core/services/auth-services';
import { OrderItem } from '../order.model';

@Component({
  selector: 'app-order-items',
  imports: [],
  templateUrl: './order-items.html',
  styleUrl: './order-items.css',
})
export class OrderItems implements OnInit {

  private readonly orderServices = inject(OrderServices);
  private readonly authServices = inject(AuthServices);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly orderItems = signal<OrderItem[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly message = signal<string | null>(null);

  private readonly currencyFormatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  });

  ngOnInit(): void {
    this.loadOrderItems();
  }

  get currentUser() {
    return this.authServices.getCurrentUser();
  }

  async loadOrderItems(): Promise<void> {
    this.isLoading.set(true);
    this.message.set('');

    try {
      const id = this.route.snapshot.paramMap.get('id');

      if (!id) {
        this.message.set('No se pudo identificar la orden');
        return;
      }

      const data = await this.orderServices.getOrder(id);
      this.orderItems.set(data.items ?? []);

      if (this.orderItems().length === 0) {
        this.message.set('No se encontraron los items de esta orden');
      }
    } catch (error: any) {
      console.error('Error al cargar los items de la orden: ', error);
      this.message.set(error.error?.message || 'Error de conexion al servidor');
    } finally {
      this.isLoading.set(false);
    }
  }

  onGoToOrderList(): void {
    const role = this.currentUser?.role;
    const basePath = role === 'admin' ? 'admin' : 'staff';
    this.router.navigate(['/', basePath, 'ordenes']);
  }

  calculateSubtotal(item: OrderItem): number {
    return item.priceAtMoment * item.quantity;
  }

  formatPrice(price: number): string {
    return this.currencyFormatter.format(price);
  }

}
