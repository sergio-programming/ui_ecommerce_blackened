import { Component, inject, signal, OnInit } from '@angular/core';
import { ProductServices } from '../../../core/services/product-services';
import { Product } from '../product.model';

@Component({
  selector: 'app-product-statistics',
  imports: [],
  templateUrl: './product-statistics.html',
  styleUrl: './product-statistics.css',
})
export class ProductStatistics implements OnInit {

  private readonly productServices = inject(ProductServices);

  readonly shirts = signal<Product[]>([]);
  readonly albums = signal<Product[]>([]);

  readonly isLoading = signal<boolean>(false);

  private readonly currencyFormatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  })

  ngOnInit(): void {
    this.loadProductStats();
  }

  async loadProductStats(): Promise<void> {
    this.isLoading.set(true);
    try {
      const data = await this.productServices.getProducts();
      const products = data ?? [];
      this.shirts.set(products.filter(product => product.category === 'Camisetas'));
      this.albums.set(products.filter(product => product.category === 'CD'));
    } catch (error) {
      console.error('Error al cargar los productos: ', error);      
    } finally {
      this.isLoading.set(false);
    }
  }

  getTotalProducts(): number {
    return this.shirts().length + this.albums().length;
  }

  getTotalUnits(): number {
    const products = [...this.shirts(), ...this.albums()];

    return products.reduce((total, product) =>
      total + (product.inventory ?? []).reduce((sum, item) => sum + item.stock, 0)
    , 0);
  }

  getTotalInventoryCost(): number {
    const products = [...this.shirts(), ...this.albums()];

    return products.reduce((total, product) => 
      total + (product.price * (product.inventory ?? []).reduce((sum, item) => sum + item.stock, 0))
    , 0);
  }

  formatPrice(price: number): string {
    return this.currencyFormatter.format(price);
  } 



}
