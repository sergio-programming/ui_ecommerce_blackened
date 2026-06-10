import { Component, inject } from '@angular/core';
import { AuthServices } from '../../core/services/auth-services';
import { RouterLinkActive, RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-footer-component',
  imports: [RouterLinkActive, RouterLinkWithHref],
  templateUrl: './footer-component.html',
  styleUrl: './footer-component.css',
})
export class FooterComponent {

  private readonly authServices = inject(AuthServices);
  
  get currentUser() {
    return this.authServices.getCurrentUser();
  }

  get links() {
    const currentUser = this.currentUser;

    if (currentUser && currentUser.role === 'admin') {
      return [
        { label: 'Tablero de Control', path: '/admin/dashboard', icon: 'fa-solid fa-chart-line' },
        { label: 'Usuarios', path: '/admin/gestion-usuarios', icon: 'fa-solid fa-users' },
        { label: 'Productos', path: '/admin/productos', icon: 'fa-solid fa-box-open' },
        { label: 'Ordenes', path: '/admin/ordenes', icon: 'fa-solid fa-receipt' } 
      ]
    }

    if (currentUser && currentUser.role === 'staff') {
      return [
        { label: 'Tablero de Control', path: '/staff/dashboard', icon: 'fa-solid fa-chart-line' },
        { label: 'Productos', path: '/staff/productos', icon: 'fa-solid fa-box-open' },
        { label: 'Ordenes', path: '/staff/ordenes', icon: 'fa-solid fa-receipt' }
      ]
    }

    if (currentUser &&  currentUser.role === 'user') {
      return [
        { label: 'Inicio', path: '/user/inicio', icon: 'fa-solid fa-house' },
        { label: 'Camisetas', path: '/user/camisetas', icon: 'fa-solid fa-shirt' },
        { label: 'Discos', path: '/user/discos', icon: 'fa-solid fa-compact-disc' },
        { label: 'Mi Cuenta', path: '/user/mi-cuenta', icon: 'fa-solid fa-user' },
      ]
    }

    return [
      { label: 'Inicio', path: '/', icon: 'fa-solid fa-house' },
      { label: 'Camisetas', path: '/camisetas', icon: 'fa-solid fa-shirt' },
      { label: 'Discos', path: '/discos', icon: 'fa-solid fa-compact-disc' }
    ]

  } 



}
