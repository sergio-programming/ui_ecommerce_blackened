import { Routes } from "@angular/router";
import { Home } from "../../public-site/home/home";
import { Shirts } from "../../public-site/shirts/shirts";
import { Albums } from "../../public-site/albums/albums";
import { ProductDetail } from "../../public-site/product-detail/product-detail";
import { ShoppingCart } from "./shopping-cart/shopping-cart";
import { CheckoutForm } from "../../../features/checkout/checkout-form/checkout-form";

export const userRoutes: Routes = [
    {
        path: '',
        children: [
            { path: '', redirectTo: 'inicio', pathMatch: 'full' },
            { path: 'inicio', component: Home, title: 'Inicio' },
            { path: 'camisetas', component: Shirts, title: 'Camisetas' },
            { path: 'camisetas/:productCode', component: ProductDetail, title: 'Detalle de Producto' },
            { path: 'discos', component: Albums, title: 'Discos' },
            { path: 'discos/:productCode', component: ProductDetail, title: 'Discos' },
            {
                path: 'mi-cuenta',
                loadChildren: () => import('./user-account-dashboard/user.account.dashboard.routes').then((m) => m.UserAccountDashboardRoutes)        
            },
            { path: 'carrito-compra', component: ShoppingCart, title: 'Carrito de Compra' },
            { path: 'pedido', component: CheckoutForm, title: 'Procesar Pedido' }
        ]
    }
    
]
