import { Routes } from "@angular/router";
import { StaffDashboard } from "./staff-dashboard/staff-dashboard";
import { OrderList } from "../../../features/order/order-list/order-list";

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
        component: OrderList,
        title: 'Lista de Ordenes'
    }
]