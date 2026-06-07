import { Routes } from "@angular/router";
import { StaffDashboard } from "./staff-dashboard/staff-dashboard";

export const staffRoutes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {
        path: 'dashboard',
        component: StaffDashboard,
        title: 'Staff Dashboard'
    },
    {
        path: 'productos',
        loadChildren: () => import('../../../features/product/product.routes').then(m => m.productRoutes)
    },
    {
        path: 'ordenes',
        loadChildren: () => import('../../../features/order/order.routes').then(m => m.orderRoutes)
    }
]
