import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductServices } from '../../../core/services/product-services';
import { Product } from '../../../features/product/product.model';
import { AuthServices } from '../../../core/services/auth-services';
import { UserSession } from '../../../features/user/user.model';
import { CartServices } from '../../../core/services/cart-services';
import { Cart, CartCreate, CartItemCreate, CartUpdate } from '../../../features/cart/cart.model';

@Component({
  selector: 'app-product-detail',
  imports: [ReactiveFormsModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit {

  private readonly cartServices = inject(CartServices);
  private readonly productServices = inject(ProductServices);
  private readonly authServices = inject(AuthServices);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly productDetail = signal<Product | null>(null);
  readonly currentUser = signal<UserSession | null>(null);
  readonly userCartExists = signal<Cart | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly message = signal<string | null>(null);

  private readonly currencyFormatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  });

  readonly productDetailForm = this.fb.nonNullable.group({
    size: ['', [Validators.required, Validators.pattern(/^(S|M|L|XL)$/)]],
    quantity: [1, [Validators.required, Validators.min(1)]]
  });

  async ngOnInit(): Promise<void> {
    const code = this.route.snapshot.paramMap.get('productCode');
    let data = this.productServices.getProductToView();

    if (!data && !code) {
      this.message.set('Producto no encontrado');
      return;
    }

    if (!data && code) {
      try {
        this.isLoading.set(true);
        data = await this.productServices.getProductByCode(code);
      } catch (error) {
        console.error('Error al cargar el producto: ', error);
        this.message.set('No se encontro el producto');
      } finally {
        this.isLoading.set(false);
      }
    }

    if (data) {
      this.productDetail.set(data);
      this.productServices.setProductToView(data);
    }

    if (!this.productRequiresSize()) {
      this.productDetailForm.controls.size.clearValidators();
      this.productDetailForm.controls.size.updateValueAndValidity();
    }

    const user = this.authServices.getCurrentUser();
    this.currentUser.set(user);

    if (user) {
      try {
        const cart = await this.cartServices.getCartByUser();
        this.userCartExists.set(cart);
      } catch {
        this.userCartExists.set(null);
      }
    }
  }

  formatPrice(price?: number | null): string {
    return this.currencyFormatter.format(price ?? 0);
  }

  get selectedStock(): number | null {
    const selectedSize = this.productDetailForm.controls.size.value;
    const selectedInventory = this.productDetail()?.inventory.find((item) => item.size === selectedSize);

    return selectedInventory?.stock ?? null;
  }

  get availableStock(): number | null {
    const product = this.productDetail();

    if (!product) {
      return null;
    }

    if (this.productRequiresSize()) {
      return this.selectedStock;
    }

    return product.inventory.reduce((total, item) => total + item.stock, 0);
  }

  decreaseQuantity(): void {
    const quantityControl = this.productDetailForm.controls.quantity;
    const currentQuantity = quantityControl.value;

    quantityControl.setValue(Math.max(1, currentQuantity - 1));
  }

  increaseQuantity(): void {
    const quantityControl = this.productDetailForm.controls.quantity;
    const currentQuantity = quantityControl.value;
    const maxQuantity = this.availableStock ?? Number.MAX_SAFE_INTEGER;

    quantityControl.setValue(Math.min(maxQuantity, currentQuantity + 1));
  }

  clampQuantityToStock(): void {
    const quantityControl = this.productDetailForm.controls.quantity;
    const currentQuantity = Number(quantityControl.value) || 1;
    const maxQuantity = this.availableStock ?? Number.MAX_SAFE_INTEGER;
    const nextQuantity = Math.min(Math.max(1, currentQuantity), maxQuantity);

    quantityControl.setValue(nextQuantity);
  }

  productRequiresSize(): boolean {
    const category = this.productDetail()?.category;
    return category === 'Camisetas' || category === 'Buzos';
  }

  private buildCartItem(): CartItemCreate {
    const product = this.productDetail();
    const formData = this.productDetailForm.getRawValue();
    const item: CartItemCreate = {
      product: product!._id,
      quantity: formData.quantity
    };

    if (this.productRequiresSize()) {
      item.size = formData.size;
    }

    return item;
  }

  private validateQuantityAgainstStock(): boolean {
    const availableStock = this.availableStock ?? 0;
    const quantity = Number(this.productDetailForm.controls.quantity.value);

    if (!Number.isInteger(quantity) || quantity < 1) {
      this.message.set('La cantidad debe ser un numero entero mayor a cero');
      return false;
    }

    if (availableStock < 1) {
      this.message.set('Producto sin stock disponible');
      return false;
    }

    if (quantity > availableStock) {
      this.productDetailForm.controls.quantity.setValue(availableStock);
      this.message.set('La cantidad supera el stock disponible');
      return false;
    }

    return true;
  }

  private getCartProductId(product: Product | string): string {
    return typeof product === 'string' ? product : product._id;
  }

  private mergeCartItem(cart: Cart, itemToAdd: CartItemCreate): CartItemCreate[] {
    const items: CartItemCreate[] = cart.items.map((item) => ({
      product: this.getCartProductId(item.product as unknown as Product | string),
      size: item.size,
      quantity: item.quantity
    }));

    const existingItemIndex = items.findIndex((item) =>
      item.product === itemToAdd.product && item.size === itemToAdd.size
    );

    if (existingItemIndex >= 0) {
      items[existingItemIndex] = {
        ...items[existingItemIndex],
        quantity: items[existingItemIndex].quantity + itemToAdd.quantity
      };
    } else {
      items.push(itemToAdd);
    }

    return items;
  }

  async onAgregateToCart(): Promise<void> {
    const user = this.currentUser();
    const product = this.productDetail();

    if (!user) {
      await this.router.navigate(['/auth/login']);
      return;
    }

    if (!product) {
      this.message.set('Producto no encontrado');
      return;
    }

    if (this.productDetailForm.invalid) {
      this.productDetailForm.markAllAsTouched();
      return;
    }

    if (!this.validateQuantityAgainstStock()) {
      return;
    }

    this.isLoading.set(true);

    try {
      const item = this.buildCartItem();
      const currentCart = this.userCartExists();

      if (currentCart) {
        const updatedData: CartUpdate = {
          items: this.mergeCartItem(currentCart, item)
        };
        const response = await this.cartServices.updateCart(currentCart._id, updatedData);
        this.userCartExists.set(response.cart);
      } else {
        const createdData: CartCreate = {
          items: [item]
        };
        const response = await this.cartServices.createCart(createdData);
        this.userCartExists.set(response.cart);
      }

      this.message.set('Producto agregado al carrito de compra');
    } catch (error: any) {
      console.error('Error al agregar al carrito de compra: ', error);
      this.message.set(error.error?.message || 'Error de conexion al servidor');
    } finally {
      this.isLoading.set(false);
    }
  }

  async onGoToCheckoutForm(): Promise<void> {
    const user = this.currentUser();
    const product = this.productDetail();

    if (!user) {
      await this.router.navigate(['/auth/login']);
      return;
    }

    if (!product) {
      this.message.set('Producto no encontrado');
      return;
    }

    if (this.productDetailForm.invalid) {
      this.productDetailForm.markAllAsTouched();
      return;
    }

    if (!this.validateQuantityAgainstStock()) {
      return;
    }

    this.isLoading.set(true);

    try {
      const item = this.buildCartItem();
      const currentCart = this.userCartExists();

      if (currentCart) {
        const updatedData: CartUpdate = {
          items: this.mergeCartItem(currentCart, item)
        }
        const response = await this.cartServices.updateCart(currentCart._id, updatedData);
        this.userCartExists.set(response.cart);      
      } else {
        const createdData: CartCreate = {
          items: [item]
        };
        const response = await this.cartServices.createCart(createdData);
        this.userCartExists.set(response.cart);
      }
      this.router.navigate(['/user/pedido']);
    } catch (error: any) {
      console.error('Error al agregar al carrito de compra: ', error);
      this.message.set(error.error?.message || 'Error de conexion al servidor');
    } finally {
      this.isLoading.set(false);
    }    
  }

}
