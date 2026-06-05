import { Component, DestroyRef, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthServices } from './core/services/auth-services';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {
  private readonly authServices = inject(AuthServices);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly title = signal('ui_ecommerce_blackened');

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event) => {
        this.redirectAnonymousUserFromPrivateRoutes(event.urlAfterRedirects);
      });

    window.addEventListener('pageshow', this.handlePageShow);
  }

  ngOnDestroy(): void {
    window.removeEventListener('pageshow', this.handlePageShow);
  }

  private readonly handlePageShow = (): void => {
    this.redirectAnonymousUserFromPrivateRoutes(window.location.pathname);
  };

  private redirectAnonymousUserFromPrivateRoutes(url: string): void {
    const isPrivateRoute = /^\/(admin|staff|user)(\/|$)/.test(url);

    if (isPrivateRoute && !this.authServices.isLoggedIn()) {
      this.router.navigate(['/auth/login'], { replaceUrl: true });
    }
  }
}
