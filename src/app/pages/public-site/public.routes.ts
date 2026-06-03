import { Routes } from '@angular/router';

import { Home } from './home/home';
import { Shirts } from './shirts/shirts';
import { Albums } from './albums/albums';
import { ProductDetail } from './product-detail/product-detail';

export const PublicSiteRoutes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: Home, title: 'Inicio' },
      { path: 'camisetas', component: Shirts, title: 'Camisetas' },
      { path: 'camisetas/:productCode', component: ProductDetail, title: 'Detalle de Producto' },
      { path: 'discos', component: Albums, title: 'Discos' },
      {
        path: 'auth',
        loadChildren: () => import('../../features/auth/auth.routes').then((m) => m.AuthRoutes),
      },
    ],
  },
];
