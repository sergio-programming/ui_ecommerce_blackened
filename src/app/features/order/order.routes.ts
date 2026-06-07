import { Routes } from "@angular/router";
import { OrderList } from "./order-list/order-list";
import { OrderEdit } from "./order-edit/order-edit";
import { OrderItems } from "./order-items/order-items";

export const orderRoutes: Routes = [
    { path: '', component: OrderList, title: 'Lista de Ordenes' },
    { path: 'articulos-orden/:id', component: OrderItems, title: 'Articulos de Orden' },
    { path: ':id', component: OrderEdit, title: 'Editar Orden' }
]
