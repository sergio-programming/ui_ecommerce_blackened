import { Product } from "../product/product.model";
import { User } from "../user/user.model";

export interface CartItem {
    _id: string;
    product: Product;
    size?: string;
    quantity: number;
    priceAtMoment: number;
}

export interface Cart {
    _id: string;
    user: User;
    items: CartItem[];
    total: number;
    createdAt: string;
    updatedAt: string;
}

export interface CartItemCreate {
    product: string;
    size?: string;
    quantity: number;
}

export interface CartCreate {
    items: CartItemCreate[];
}

export interface CartUpdate {
    items: CartItemCreate[];
}

export interface CartItemUpdate {
    quantity: number;
}

export interface CartResponse {
    message: string;
    cart: Cart;
}

