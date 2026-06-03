import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductServices } from '../../../core/services/product-services';
import { Product, ProductInventory } from '../product.model';

@Component({
  selector: 'app-product-list',
  imports: [],
  templateUrl: './product-list.html',
})
export class ProductList implements OnInit {

  private readonly currencyFormatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  });

  private readonly productServices = inject(ProductServices);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  products: Product[] = [];

  readonly isLoading = signal<boolean>(false);
  readonly message = signal<string | null>(null);

  ngOnInit(): void {
    this.loadProducts();
  }

  async loadProducts(): Promise<void> {
    this.isLoading.set(true);
    this.message.set('');

    try {
      const data = await this.productServices.getProducts();
      this.products = data ?? [];

      if (this.products.length === 0) {
        this.message.set('No hay productos registrados actualmente');
      }
    } catch (error: any) {
      console.error('Error al cargar los productos: ', error);
      this.message.set(error.error?.message || 'Error de conexion al servidor');
    } finally {
      this.isLoading.set(false);
    }
  }

  async onDeleteProduct(_id: string): Promise<void> {
    if (confirm('Estas seguro de eliminar este producto?')) {
      this.isLoading.set(true);
      this.message.set('');

      try {
        const response = await this.productServices.deleteProduct(_id);
        this.message.set(response.message);
        await this.loadProducts();
      } catch (error: any) {
        console.error('Error al eliminar el producto: ', error);
        this.message.set(error.error?.message || 'Error de conexion al servidor');
      } finally {
        this.isLoading.set(false);
      }
    }
  }

  onGoToCreateProductForm(): void {
    this.productServices.setProductToEdit(null);
    this.router.navigate(['crear'], { relativeTo: this.route });
  }

  onGoToUpdateProductForm(product: Product): void {
    this.productServices.setProductToEdit(product);
    this.router.navigate(['editar', product._id], { relativeTo: this.route });
  }

  formatPrice(price: number): string {
    return this.currencyFormatter.format(price);
  }

  getTotalStock(inventory: ProductInventory[]): number {
    return inventory.reduce((total, item) => total + item.stock, 0);
  }

}
