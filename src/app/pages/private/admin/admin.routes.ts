import { Routes } from "@angular/router";
import { AdminDashboard } from "./admin-dashboard/admin-dashboard";
import { OrderList } from "../../../features/order/order-list/order-list";

export const adminRoutes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {
        path: 'dashboard',
        component: AdminDashboard,
        title: 'Admin Dashboard'
    },
    {
        path: 'gestion-usuarios',
        loadChildren: () => import('../../../features/user/user.management.routes').then(m => m.userManagementRoutes)
    },
    {
        path: 'productos',
        loadChildren: () => import('../../../features/product/product.routes').then(m => m.productRoutes)
    },
    {
        path: 'ordenes',
        component: OrderList,
        title: 'Lista de Ordenes'
    }
]