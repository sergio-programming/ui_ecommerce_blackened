import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product, ProductCreate, ProductResponse, ProductUpdate } from '../../features/product/product.model';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class ProductServices {

  private readonly apiUrl = `${API_BASE_URL}/products`;
  
  private readonly http = inject(HttpClient);

  private readonly productToEdit = signal<Product | null>(null)
  private readonly productToView = signal<Product | null>(null)

  
  async getProducts(): Promise<Product[]> {
    return await firstValueFrom(
      this.http.get<Product[]>(`${this.apiUrl}`)
    );
  }

  async getProduct(_id: string): Promise<Product> {
    return await firstValueFrom(
      this.http.get<Product>(`${this.apiUrl}/${_id}`)
    );
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await firstValueFrom(
      this.http.get<Product[]>(`${this.apiUrl}/category/${encodeURIComponent(category)}`)
    );
  }

  async getProductByCode(productCode: string): Promise<Product> {
    return await firstValueFrom(
      this.http.get<Product>(`${this.apiUrl}/code/${encodeURIComponent(productCode)}`)
    );
  }

  async createProduct(data: ProductCreate): Promise<ProductResponse> {
    return await firstValueFrom(
      this.http.post<ProductResponse>(`${this.apiUrl}`, data)
    );
  }

  async updateProduct(_id: string, data: ProductUpdate): Promise<ProductResponse> {
    return await firstValueFrom(
      this.http.put<ProductResponse>(`${this.apiUrl}/${_id}`, data)
    );
  }

  async deleteProduct(_id: string): Promise<ProductResponse> {
    return await firstValueFrom(
      this.http.delete<ProductResponse>(`${this.apiUrl}/${_id}`)
    );
  }

  setProductToEdit(product: Product | null): void {
    this.productToEdit.set(product);
  }
  
  getProductToEdit(): Product | null {
    return this.productToEdit() ?? null;
  }

  setProductToView(product: Product | null): void {
    this.productToView.set(product);
  }

  getProductToView(): Product | null {
    return this.productToView() ?? null;
  }

}
