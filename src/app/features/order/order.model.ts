import { User } from "../user/user.model";
import { Product } from "../product/product.model";

export type OrderStatus = 'Pendiente' | 'Enviada' | 'Entregada' | 'Cancelada';
export type PaymentStatus = 'Pendiente' | 'Pagada' | 'Rechazado';
export type ShippingMethod = 'Estandar' | 'Express';
export type PaymentMethod = 'Contraentrega' | 'Stripe';

export interface OrderItem {
    _id: string;
    product: Product;
    size: string;
    quantity: number;
    priceAtMoment: number;
}

export interface Order {
    _id: string;
    user: User;
    items: OrderItem[];
    shippingAddress: string;
    city: string;
    phoneNumber: string;
    shippingMethod: ShippingMethod;
    paymentMethod: PaymentMethod;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    total: number;
}

export interface OrderCreateItem {
    product: string;
    size?: string;
    quantity: number;
}

export interface OrderCreate {
    user: string;
    items: OrderCreateItem[];
    shippingAddress: string;
    city: string;
    phoneNumber: string;
    shippingMethod: ShippingMethod;
    paymentMethod: PaymentMethod;
}

export interface OrderUpdate {
    items?: OrderCreateItem[];
    shippingAddress?: string;
    city?: string;
    phoneNumber?: string,
    shippingMethod?: ShippingMethod;
    paymentMethod?: PaymentMethod;
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
}

export interface OrderResponse {
    message: string;
    order: Order;
}
