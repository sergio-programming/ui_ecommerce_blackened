import { Routes } from '@angular/router';
import { HomeSiteLayout } from './layouts/home-site-layout/home-site-layout';
import { DashboardLayout } from './layouts/dashboard-layout/dashboard-layout';
import { adminGuard } from './core/guards/admin-guard';
import { staffGuard } from './core/guards/staff-guard';
import { userGuard } from './core/guards/user-guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeSiteLayout,
    loadChildren: () => import('./pages/public-site/public.routes').then((m) => m.PublicSiteRoutes),
  },
  {
    path: 'admin',
    component: DashboardLayout,
    canActivate: [adminGuard],
    loadChildren: () => import('./pages/private/admin/admin.routes').then((m) => m.adminRoutes)
  },
  {
    path: 'staff',
    component: DashboardLayout,
    canActivate: [staffGuard],
    loadChildren: () => import('./pages/private/staff/staff.routes').then((m) => m.staffRoutes)
  },
  {
    path: 'user',
    component: DashboardLayout,
    canActivate: [userGuard],
    loadChildren: () => import('./pages/private/user/user.routes').then((m) => m.userRoutes)
  },
  { path: '**', redirectTo: '' }
];
