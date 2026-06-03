import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';

export const AuthRoutes: Routes = [
  { path: 'login', component: Login, title: 'Inicio de Sesión' },
  { path: 'register', component: Register, title: 'Registro de Cuenta' }
];
