import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthServices } from '../../core/services/auth-services';

@Component({
  selector: 'app-header-component',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header-component.html',
  styleUrl: './header-component.css',
})
export class HeaderComponent {

  private readonly authServices = inject(AuthServices);
  private readonly router = inject(Router);
  mobileMenuOpen = false;

  get currentUser() {
    return this.authServices.getCurrentUser();
  }

  get links() {
    const currentUser = this.currentUser;

    if(currentUser?.role === 'admin') {
      return [
        { label: 'Dashboard', path: '/admin/dashboard', icon: 'fa-solid fa-chart-line' },
        { label: 'Usuarios', path: '/admin/gestion-usuarios', icon: 'fa-solid fa-users' },
        { label: 'Productos', path: '/admin/productos', icon: 'fa-solid fa-box-open' },
        { label: 'Ordenes', path: '/admin/ordenes', icon: 'fa-solid fa-receipt' }
      ]
    }

    if(currentUser?.role === 'staff') {
      return [
        { label: 'Dashboard', path: '/staff/dashboard', icon: 'fa-solid fa-chart-line' },
        { label: 'Productos', path: '/staff/productos', icon: 'fa-solid fa-box-open' },
        { label: 'Ordenes', path: '/staff/ordenes', icon: 'fa-solid fa-receipt' }
      ]
    }

    if(currentUser?.role === 'user') {
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

  onGoToLogin(): void {
    this.closeMobileMenu();
    this.router.navigate(['/auth/login']);
  }

  onShoppingCartButton(): void {
    const currentUser = this.currentUser;
    if (currentUser) {
      this.router.navigate(['user/carrito-compra']);
    } else {
      this.router.navigate(['/auth/login']);
    }      
  }

  async onLogout(): Promise<void> {
    try {
      await this.authServices.logout();
      this.closeMobileMenu();
      this.router.navigate(['/auth/login'], { replaceUrl: true });
    } catch (error) {
      console.error('Error al cerrar sesión: ', error);
    }
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }
}
