import { Routes } from "@angular/router";
import { UserList } from "./user-list/user-list";
import { UserForm } from "./user-form/user-form";

export const userManagementRoutes: Routes = [
    {
        path: '',
        children: [
            { path: '', component: UserList, title: 'Lista de Usuarios' },
            { path: 'crear', component: UserForm, title: 'Crear Usuario' },
            { path: 'editar/:id', component: UserForm, title: 'Actualizar Usuario' }
        ]
    }
]