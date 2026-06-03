import { Cart } from "../cart/cart.model";
import { User } from "../user/user.model";

export type ShippingMethod = 'Estandar' | 'Express';
export type PaymentMethod = 'Contraentrega' | 'Stripe';

export interface Checkout {
    _id: string;
    cart: Cart;
    user: User;
    shippingAddress: string;
    city: string;
    shippingMethod: ShippingMethod;
    paymentMethod: PaymentMethod;
    total: number;
    createdAt: string;
    updatedAt: string;
}

export interface CheckoutCreate {
    cart: string;
    shippingAddress: string;
    city: string;
    shippingMethod: ShippingMethod;
    paymentMethod: PaymentMethod;
}

export interface CheckoutUpdate {
    shippingAddress?: string;
    city?: string;
    shippingMethod?: ShippingMethod;
    paymentMethod?: PaymentMethod;
}

export interface CheckoutResponse {
    message: string;
    checkout: Checkout;
}
