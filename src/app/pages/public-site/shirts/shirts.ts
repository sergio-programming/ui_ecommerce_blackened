import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductServices } from '../../../core/services/product-services';
import { Product, ProductInventory } from '../../../features/product/product.model';

@Component({
  selector: 'app-shirts',
  imports: [RouterLink],
  templateUrl: './shirts.html',
  styleUrl: './shirts.css',
})
export class Shirts implements OnInit {

  shirts: Product[] = [];

  private readonly productServices = inject(ProductServices);

  readonly isLoading = signal<boolean>(false);
  readonly message = signal<string | null>(null);

  private readonly currencyFormatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  })

  ngOnInit(): void {
    this.loadShirts();
  }

  async loadShirts(): Promise<void> {
    this.isLoading.set(true);
    this.message.set('');

    try {
      const data = await this.productServices.getProductsByCategory('Camisetas');
      this.shirts = data ?? [];
      if (this.shirts.length === 0) {
        this.message.set('No hay camisetas disponibles actualmente');
      }
    } catch (error: any) {
      console.error('Error al cargar las camisetas: ', error);
      this.message.set(error.error?.message || 'Error de conexión al servidor');
    } finally {
      this.isLoading.set(false);
    }
  }

  getAvailableSizes(shirt: Product): ProductInventory[] {
    const inventory = shirt.inventory ?? [];

    return inventory.filter((item) => item.stock > 0);
  }

  getTotalStock(shirt: Product): number {
    const inventory = shirt.inventory ?? [];

    return inventory.reduce((total, item) => total + item.stock, 0);
  }

  formatPrice(price: number): string {
    return this.currencyFormatter.format(price)
  }

  hasAvailableSizes(shirt: Product): boolean {
    return this.getAvailableSizes(shirt).length > 0;
  }

  onGoToProductDetail(product: Product): void {
    this.productServices.setProductToView(product);
  }

}