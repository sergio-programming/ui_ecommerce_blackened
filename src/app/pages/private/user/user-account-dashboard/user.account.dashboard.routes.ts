import { Routes } from "@angular/router";
import { UserAccountDashboard } from "./user-account-dashboard";
import { MyAccount } from "../my-account/my-account";
import { Addresses } from "../addresses/addresses";
import { OrderHistory } from "../order-history/order-history";
import { UserEditingForm } from "../user-editing-form/user-editing-form";

export const UserAccountDashboardRoutes: Routes = [
    {
        path: '',
        component: UserAccountDashboard,
        children: [
            { path: '', component: MyAccount, title: 'Mi Cuenta' },
            { path: 'editar-cuenta', component: UserEditingForm, title: 'Editar Cuenta' },
            { path: 'direcciones', component: Addresses, title: 'Direcciones registradas' },
            { path: 'historial-ordenes', component: OrderHistory, title: 'Historial de ordenes' }
        ]
    }
]
