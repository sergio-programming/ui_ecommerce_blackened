import { Component, DestroyRef, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductServices } from '../../../core/services/product-services';
import { AuthServices } from '../../../core/services/auth-services';
import { Product, ProductCreate, ProductUpdate, ProductInventory } from '../product.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductForm implements OnInit {

  private readonly productServices = inject(ProductServices);
  private readonly authServices = inject(AuthServices);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly productToEdit = signal<Product | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly message = signal<string | null>(null);

  readonly CategoryOptions = ['Camisetas', 'Buzos', 'CD'];
  readonly SizeOptions = [

    { label: 'Talla S', value: 'S'}, 
    { label: 'Talla M', value: 'M' }, 
    { label: 'Talla L', value: 'L' },
    { label: 'Talla XL', value: 'XL' }
  ];

  readonly productForm = this.fb.nonNullable.group({
    productCode: ['', [Validators.required, Validators.pattern(/^[A-Z]{3}-\d{4}$/)]],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
    category: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0)]],
    image: ['', [Validators.required]],
    inventory: this.fb.array<FormGroup>([])
  });

  get inventoryArray(): FormArray {
    return this.productForm.get('inventory') as FormArray;
  }

  // Crear un item de inventario
  createInventoryItem(item?: ProductInventory): FormGroup {
    return this.fb.group({
      size: [item?.size || ''],
      stock: [item?.stock ?? 0, [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]]
    });
  }

  // Agregar fila
  addInventoryItem(): void {
    this.inventoryArray.push(this.createInventoryItem());
  }

  // Eliminar fila
  removeInventoryItem(index: number): void {
    this.inventoryArray.removeAt(index);
  }

  async ngOnInit(): Promise<void> {
    let data = await this.productServices.getProductToEdit();
    const id = this.route.snapshot.paramMap.get('id');

    if (!data && id) {
      try {
        this.isLoading.set(true);
        data = await this.productServices.getProduct(id);
      } catch (error) {
        console.error(error);
        this.message.set('No se encontró el producto');
      } finally {
        this.isLoading.set(false);
      }
    }

    if (data) {
      this.productToEdit.set(data);

      this.productForm.patchValue({
        productCode: data.productCode,
        description: data.description,
        category: data.category,
        price: data.price,
        image: data.image
      });

      if (data.inventory?.length) {
        data.inventory.forEach(item => {
          this.inventoryArray.push(this.createInventoryItem(item));
        });
      }
    } else {
      // Si es creación → inicia con una fila
      this.addInventoryItem();
    }

    // Reacción al cambio de categoría
    this.productForm.get('category')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(category => {
      if (category === 'CD') {
        this.inventoryArray.controls.forEach(ctrl => {
          ctrl.get('size')?.setValue('');
        });
      }
    });
  }

  private buildProductPayload(): ProductCreate | ProductUpdate | null {
    const formValue = this.productForm.getRawValue();
    const category = formValue.category as ProductCreate['category'];
    const normalizedInventory = formValue.inventory.map((item) => ({
      size: item['size']?.trim() || undefined,
      stock: Number(item['stock'])
    }));

    if (!Number.isFinite(formValue.price) || formValue.price < 0) {
      this.message.set('El precio debe ser un numero mayor o igual a cero');
      return null;
    }

    if (normalizedInventory.length === 0) {
      this.message.set('Debes ingresar inventario');
      return null;
    }

    if (normalizedInventory.some((item) => !Number.isInteger(item.stock) || item.stock < 0)) {
      this.message.set('El stock debe ser un numero entero mayor o igual a cero');
      return null;
    }

    if (category === 'CD') {
      if (normalizedInventory.length !== 1) {
        this.message.set('Los productos CD solo deben tener una entrada de inventario');
        return null;
      }

      normalizedInventory[0].size = undefined;
    } else {
      const sizes = normalizedInventory.map((item) => item.size);
      const uniqueSizes = new Set(sizes);

      if (sizes.some((size) => !size || !['S', 'M', 'L', 'XL'].includes(size))) {
        this.message.set('Todas las prendas deben tener una talla valida');
        return null;
      }

      if (uniqueSizes.size !== sizes.length) {
        this.message.set('No se permite duplicar tallas');
        return null;
      }
    }

    return {
      productCode: formValue.productCode.trim().toUpperCase(),
      description: formValue.description.trim(),
      category,
      price: Number(formValue.price),
      image: formValue.image.trim(),
      inventory: normalizedInventory
    };
  }

  async onSubmit(): Promise<void> {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.message.set(null);

    try {
      const payload = this.buildProductPayload();

      if (!payload) {
        return;
      }

      if (this.productToEdit()) {
        const response = await this.productServices.updateProduct(
          this.productToEdit()!._id,
          payload as ProductUpdate
        );
        this.message.set(response.message);
      } else {
        const response = await this.productServices.createProduct(
          payload as ProductCreate
        );
        this.message.set(response.message);
      }

      const role = this.authServices.getCurrentUser()?.role;
      const basePath = role === 'admin' ? '/admin/productos' : '/staff/productos';

      setTimeout(() => this.router.navigate([basePath]), 2000);

    } catch (error: any) {
      console.error(error);
      this.message.set(error.error?.message || 'Error en el servidor');
    } finally {
      this.isLoading.set(false);
    }
  }

  onCancel(): void {
    const role = this.authServices.getCurrentUser()?.role;
    const basePath = role === 'admin' ? '/admin/productos' : '/staff/productos';
    this.router.navigate([basePath]);
  }
}
