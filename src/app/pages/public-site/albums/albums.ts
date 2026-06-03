import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../features/product/product.model';
import { ProductServices } from '../../../core/services/product-services';

@Component({
  selector: 'app-albums',
  imports: [RouterLink],
  templateUrl: './albums.html',
  styleUrl: './albums.css',
})
export class Albums implements OnInit {

  albums: Product[] = [];

  private readonly productServices = inject(ProductServices);

  readonly isLoading = signal<boolean>(false);
  readonly message = signal<string | null>(null);

  private readonly currencyFormatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  })

  ngOnInit(): void {
    this.loadAlbums();
  }

  async loadAlbums(): Promise<void> {
    this.isLoading.set(true);
    this.message.set('');

    try {
      const data = await this.productServices.getProductsByCategory('CD');
      this.albums = data ?? [];

      if (this.albums.length === 0) {
        this.message.set('No hay discos disponibles actualmente');
      }
    } catch (error: any) {
      console.error('Error al cargar los discos: ', error);
      this.message.set(error.error?.message || 'Error de conexiÃ³n al servidor');
    } finally {
      this.isLoading.set(false);
    }
  }

  getAlbumStock(album: Product): number {
    const inventory = album.inventory ?? [];

    return inventory.reduce((total, item) => total + item.stock, 0);
  }

  formatPrice(price: number): String {
    return this.currencyFormatter.format(price);
  }

  onGoToProductDetail(product: Product): void {
    this.productServices.setProductToView(product);
  }

}
