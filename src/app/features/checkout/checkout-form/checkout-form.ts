import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderServices } from '../../../core/services/order-services';
import { CartServices } from '../../../core/services/cart-services';
import { UserServices } from '../../../core/services/user-services';
import { CheckoutServices } from '../../../core/services/checkout-services';
import { Cart, CartItem } from '../../cart/cart.model';
import { User } from '../../user/user.model';
import { OrderCreate, PaymentMethod, ShippingMethod } from '../../order/order.model';

@Component({
  selector: 'app-checkout-form',
  imports: [ReactiveFormsModule],
  templateUrl: './checkout-form.html',
  styleUrl: './checkout-form.css',
})
export class CheckoutForm implements OnInit {

  private readonly cartServices = inject(CartServices);
  private readonly checkoutServices = inject(CheckoutServices);
  private readonly userServices = inject(UserServices);
  private readonly orderServices = inject(OrderServices);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly userInfo = signal<User | null>(null);
  readonly cartInfo = signal<Cart | null>(null);
  readonly cartItems = signal<CartItem[]>([]);
  readonly transportationCost = signal<number>(0);
  readonly totalOrder = signal<number>(0);
  readonly isLoading = signal<boolean>(false);
  readonly message = signal<string | null>(null);
  readonly orderCreated = signal<boolean>(false);
  readonly createdOrderMessage = signal<string | null>(null);

  readonly shippingMethodOptions = ['Estandar', 'Express'];
  readonly paymentMethodOptions = [
    { label: 'Contraentrega', icon: 'fa-solid fa-money-bill-wave' },
    { label: 'Stripe', icon: 'fa-brands fa-stripe' }
  ];

  private readonly currencyFormatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  })

  readonly checkoutForm = this.fb.nonNullable.group({
    shippingAddress: ['', [Validators.required, Validators.minLength(10)]],
    city: ['', [Validators.required, Validators.minLength(2)]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    documentNumber: [''],
    shippingMethod: ['', [Validators.required, Validators.pattern(/^(Estandar|Express)$/)]],
    paymentMethod: ['', [Validators.required, Validators.pattern(/^(Contraentrega|Stripe)$/)]],
  });

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadCartAndCartItems();
  }

  async loadUserProfile(): Promise<void> {
    this.isLoading.set(true);

    try {
      const user = await this.userServices.getUserProfile();
      this.userInfo.set(user ?? null);
      this.configureDocumentNumberControl(user);
    } catch (error) {
      console.error('Error al cargar la informacion del usuario: ', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  async loadCartAndCartItems(): Promise<void> {
    this.isLoading.set(true);

    try {
      const cart = await this.cartServices.getCartByUser();
      this.cartInfo.set(cart ?? null);
      this.cartItems.set(cart.items ?? []);
    } catch (error) {
      console.error('Error al cargar los items del carrito: ', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    const cartItems = this.cartItems();
    const formData = this.checkoutForm.getRawValue();
    const paymentMethod = formData.paymentMethod as PaymentMethod;

    if (!this.userInfo()?._id) {
      this.message.set('No se pudo identificar el usuario para crear la orden');
      return;
    }

    if (cartItems.length === 0) {
      this.message.set('No hay productos en el carrito para crear la orden');
      return;
    }

    if (paymentMethod === 'Contraentrega') {
      this.isLoading.set(true);
      this.message.set(null);

      try {
        if (!this.userInfo()?.documentNumber) {
          const documentNumber = formData.documentNumber.trim();
          const userResponse = await this.userServices.updateUserDocumentNumber({ documentNumber });
          this.userInfo.set(userResponse.user);
        }

        const createdData: OrderCreate = {
          items: cartItems.map((item) => ({
            product: item.product._id,
            size: item.size,
            quantity: item.quantity,
          })),
          shippingAddress: formData.shippingAddress.trim(),
          city: formData.city.trim(),
          phoneNumber: formData.phoneNumber.trim(),
          shippingMethod: formData.shippingMethod as ShippingMethod,
          paymentMethod,
        };

        const response = await this.orderServices.createOrder(createdData);

        try {
          if (this.cartInfo()?._id) {
            await this.cartServices.deleteCart(this.cartInfo()!._id);
          }
        } catch (cartError) {
          console.error('La orden fue creada, pero no se pudo eliminar el carrito:', cartError);
        }

        this.createdOrderMessage.set(response.message);
        this.orderCreated.set(true);
        this.cartInfo.set(null);
        this.cartItems.set([]);
        this.transportationCost.set(0);
        this.checkoutForm.reset();
      } catch (error: any) {
        console.error('Error al crear la orden: ', error);
        this.message.set(error.error?.message || 'Error interno del servidor');
      } finally {
        this.isLoading.set(false);
      }      
    } else {
      this.message.set('El pago con Stripe aun no esta disponible');
    }
  }

  calculateSubtotalItemCart(price: number, quantity: number): string {
    return this.currencyFormatter.format(price * quantity);
  }

  calculateTransportationCost(): void {
    const shippingMethod = this.checkoutForm.get('shippingMethod')?.getRawValue();
    if (shippingMethod === 'Estandar') {
      this.transportationCost.set(8000);
    } else if (shippingMethod === 'Express') {
      this.transportationCost.set(12000);
    } else {
      this.transportationCost.set(0);
    }
  }

  calculateTotalOrder(subtotal: number, transportationCost: number): string {
    const total = subtotal + transportationCost;
    return this.currencyFormatter.format(total);
  }

  private configureDocumentNumberControl(user: User | null): void {
    const documentNumberControl = this.checkoutForm.get('documentNumber');

    if (!documentNumberControl) {
      return;
    }

    if (user?.documentNumber) {
      documentNumberControl.clearValidators();
      documentNumberControl.setValue('');
    } else {
      documentNumberControl.setValidators([
        Validators.required,
        Validators.pattern(/^\d{6,10}$/)
      ]);
    }

    documentNumberControl.updateValueAndValidity();
  }

  onGoToShoppingCart(): void {
    this.router.navigate(['/user/carrito-compra']);
  }

  onGoToOrderHistory(): void {
    this.router.navigate(['/user/mi-cuenta/historial-ordenes']);
  }

  onGoToHome(): void {
    this.router.navigate(['/user/inicio']);
  }

  formatPrice(price: number | undefined | null): string {
    return this.currencyFormatter.format(price ?? 0);
  }

}
