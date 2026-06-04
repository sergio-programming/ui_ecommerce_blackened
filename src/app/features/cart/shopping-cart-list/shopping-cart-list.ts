import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartServices } from '../../../core/services/cart-services';
import { UserServices } from '../../../core/services/user-services';
import { Cart, CartItem } from '../cart.model';


@Component({
  selector: 'app-shopping-cart-list',
  imports: [],
  templateUrl: './shopping-cart-list.html',
  styleUrl: './shopping-cart-list.css',
})
export class ShoppingCartList implements OnInit {

  private readonly cartServices = inject(CartServices);
  private readonly userServices = inject(UserServices);
  private readonly router = inject(Router);

  readonly cart = signal<Cart | null>(null);
  readonly cartItems = signal<CartItem[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly message = signal<string | null>(null);
  readonly updatingItemId = signal<string | null>(null);

  private readonly currencyFormatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  })

  ngOnInit(): void {
    this.loadCartItems();
  }

  async loadCartItems(): Promise<void> {
    this.isLoading.set(true);
    this.message.set('');

    try {
      await this.userServices.getUserProfile();
      const cartData = await this.cartServices.getCartByUser();
      this.cart.set(cartData);
      this.cartItems.set(cartData.items);
    } catch (error: any) {
      console.error('Error al cargar los items del carrito: ', error);

      if (error.status === 404) {
        this.cart.set(null);
        this.cartItems.set([]);
        this.message.set('Tu carrito esta vacio');
        return;
      }

      this.message.set(error.error?.message || 'Error de conexion al servidor');
    } finally {
      this.isLoading.set(false);
    }
  }

  async onDeleteCart(_id: string): Promise<void> {
    this.isLoading.set(true);
    this.message.set('');

    try {
      const response = await this.cartServices.deleteCart(_id);
      this.cart.set(null);
      this.cartItems.set([]);
      this.message.set(response.message || 'Tu carrito esta vacio');
    } catch (error: any) {
      console.error('Error al eliminar el carrito: ', error);
      this.message.set(error.error?.message || 'Error de conexion al servidor');
    } finally {
      this.isLoading.set(false);
    }
  }

  async onDeleteCartItem(_id: string, itemId: string): Promise<void> {
    this.isLoading.set(true);
    this.message.set('');

    try {
      const response = await this.cartServices.deleteCartItem(_id, itemId);
      this.cart.set(response.cart);
      this.cartItems.set(response.cart.items);
      this.message.set(response.cart.items.length ? response.message : 'Tu carrito esta vacio');
    } catch (error: any) {
      console.error('Error al eliminar el item del carrito: ', error);
      this.message.set(error.error?.message || 'Error de conexion al servidor');
    } finally {
      this.isLoading.set(false);
    }
  }

  async onUpdateCartItemQuantity(_id: string, item: CartItem, quantity: number): Promise<void> {
    if (!Number.isInteger(quantity) || quantity < 1 || this.updatingItemId()) {
      return;
    }

    this.updatingItemId.set(item._id);
    this.message.set('');

    try {
      const response = await this.cartServices.updateCartItem(_id, item._id, { quantity });
      this.cart.set(response.cart);
      this.cartItems.set(response.cart.items);
      this.message.set(response.message);
    } catch (error: any) {
      console.error('Error al actualizar la cantidad del item: ', error);
      this.message.set(error.error?.message || 'Error de conexion al servidor');
    } finally {
      this.updatingItemId.set(null);
    }
  }

  calculateSubtotal(price: number, quantity: number): string {
    const subtotal = price * quantity;
    return this.currencyFormatter.format(subtotal);
  };

  formatPrice(price: number | undefined | null): string {
    return this.currencyFormatter.format(price ?? 0);
  }

  onGoToHome(): void {
    this.router.navigate(['/user/inicio']);
  }

  onGoToCheckoutForm(): void {
    this.router.navigate(['/user/pedido']);
  }
}
