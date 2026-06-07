import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServices } from '../../../core/services/auth-services';
import { Order, OrderStatus, PaymentStatus } from '../order.model';
import { OrderServices } from '../../../core/services/order-services';

@Component({
  selector: 'app-order-edit',
  imports: [ReactiveFormsModule],
  templateUrl: './order-edit.html',
  styleUrl: './order-edit.css',
})
export class OrderEdit implements OnInit {

  private readonly orderServices = inject(OrderServices);
  private readonly authServices = inject(AuthServices);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly order = signal<Order | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly message = signal<string | null>(null);

  readonly orderStatusOptions: OrderStatus[] = ['Pendiente', 'Enviada', 'Entregada', 'Cancelada'];
  readonly paymentStatusOptions: PaymentStatus[] = ['Pendiente', 'Pagada', 'Rechazado'];

  readonly orderForm = this.fb.nonNullable.group({
    status: ['Pendiente' as OrderStatus, [Validators.required]],
    paymentStatus: ['Pendiente' as PaymentStatus, [Validators.required]]
  });

  ngOnInit(): void {
    this.loadOrder();
  }

  get currentUser() {
    return this.authServices.getCurrentUser();
  }

  async loadOrder(): Promise<void> {
    this.isLoading.set(true);
    this.message.set(null);

    try {
      const id = this.route.snapshot.paramMap.get('id');

      if (!id) {
        this.message.set('No se pudo identificar la orden');
        return;
      }

      const order = await this.orderServices.getOrder(id);
      this.order.set(order);
      this.orderForm.patchValue({
        status: order.status,
        paymentStatus: order.paymentStatus
      });
    } catch (error: any) {
      console.error('Error al cargar la orden: ', error);
      this.message.set(error.error?.message || 'Error de conexion al servidor');
    } finally {
      this.isLoading.set(false);
    }
  }

  async onSubmit(): Promise<void> {
    const order = this.order();

    if (!order) {
      this.message.set('No hay una orden para actualizar');
      return;
    }

    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.message.set(null);

    try {
      const response = await this.orderServices.updateOrder(order._id, this.orderForm.getRawValue());
      this.message.set(response.message);
      await this.onGoToOrderList();
    } catch (error: any) {
      console.error('Error al actualizar la orden: ', error);
      this.message.set(error.error?.message || 'Error de conexion al servidor');
    } finally {
      this.isLoading.set(false);
    }
  }

  async onGoToOrderList(): Promise<void> {
    const role = this.currentUser?.role;
    const basePath = role === 'admin' ? 'admin' : 'staff';
    await this.router.navigate(['/', basePath, 'ordenes']);
  }

}
