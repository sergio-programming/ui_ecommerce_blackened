import { Routes } from "@angular/router";
import { ProductList } from "./product-list/product-list";
import { ProductForm } from "./product-form/product-form";

export const productRoutes: Routes = [
    {
        path: '',
        children: [
            { path: '', component: ProductList, title: 'Lista de Productos' },
            { path: 'crear', component: ProductForm, title: 'Crear Producto' },
            { path: 'editar/:id', component: ProductForm, title: 'Actualizar Producto' },
        ]
    }
]
