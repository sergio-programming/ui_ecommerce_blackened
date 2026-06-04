export type ProductCategories = 'Camisetas' | 'Buzos' | 'CD';

export interface ProductInventory {
    size?: string;
    stock: number;
}

export interface Product {
    _id: string;
    productCode: string;
    description: string;
    category: ProductCategories;
    price: number;
    image: string;
    inventory: ProductInventory[];
    createdAt: string;
    updatedAt: string;
}

export interface ProductCreate {
    productCode: string;
    description: string;
    category: ProductCategories;
    price: number;
    image: string;
    inventory: ProductInventory[];
}

export type ProductUpdate = Partial<ProductCreate>;

export interface ProductResponse {
    message: string;
    product: Product
}
