import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ProductServices } from '../../../core/services/product-services';
import { Product } from '../../../features/product/product.model';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {

  private readonly productServices = inject(ProductServices);
  private readonly currencyFormatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  });

  readonly featuredProducts = signal<Product[]>([])
  readonly isLoading = signal<boolean>(false);

  protected readonly carouselImages = [
    {
      src: '/Carousel1.jpg',
      alt: 'Disenos de camisetas Blackened en exhibicion',
    },
    {
      src: '/Carousel2.jpg',
      alt: 'Coleccion Blackened con estilo Heavy Metal',
    },
    {
      src: '/Carousel3.jpg',
      alt: 'Detalle de camisetas y estampados de Blackened',
    },
  ];

  protected readonly currentSlide = signal(0);
  private autoplayId?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.startAutoplay();
    this.loadFeaturedProducts();
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  protected goToSlide(index: number): void {
    this.currentSlide.set(index);
    this.restartAutoplay();
  }

  protected nextSlide(): void {
    this.currentSlide.update((current) => (current + 1) % this.carouselImages.length);
    this.restartAutoplay();
  }

  protected previousSlide(): void {
    this.currentSlide.update(
      (current) => (current - 1 + this.carouselImages.length) % this.carouselImages.length,
    );
    this.restartAutoplay();
  }

  private startAutoplay(): void {
    this.autoplayId = setInterval(() => {
      this.currentSlide.update((current) => (current + 1) % this.carouselImages.length);
    }, 5000);
  }

  private stopAutoplay(): void {
    if (this.autoplayId) {
      clearInterval(this.autoplayId);
      this.autoplayId = undefined;
    }
  }

  private restartAutoplay(): void {
    this.stopAutoplay();
    this.startAutoplay();
  }

  async loadFeaturedProducts(): Promise<void> {
    this.isLoading.set(true);
    try {
      const shirts = await this.productServices.getProductsByCategory('Camisetas');
      const albums = await this.productServices.getProductsByCategory('CD');
      this.featuredProducts.set([...shirts.slice(0, 3), ...albums.slice(0, 3)]);
    } catch (error) {
      console.error('Error al cargar los productos destacados: ', error);      
    } finally {
      this.isLoading.set(false);
    }
  }

  protected formatPrice(price: number): string {
    return this.currencyFormatter.format(price);
  }

  protected getTotalStock(product: Product): number {
    return product.inventory.reduce((total, item) => total + item.stock, 0);
  }
}
