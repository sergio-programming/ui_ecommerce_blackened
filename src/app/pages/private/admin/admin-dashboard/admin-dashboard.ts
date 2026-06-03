import { Component } from '@angular/core';
import { UserStatistics } from '../../../../features/user/user-statistics/user-statistics';
import { ProductStatistics } from '../../../../features/product/product-statistics/product-statistics';
import { OrderStatistics } from '../../../../features/order/order-statistics/order-statistics';

@Component({
  selector: 'app-admin-dashboard',
  imports: [UserStatistics, ProductStatistics, OrderStatistics],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {}
