import { Component } from '@angular/core';
import { ProductStatistics } from '../../../../features/product/product-statistics/product-statistics';
import { OrderStatistics } from '../../../../features/order/order-statistics/order-statistics';

@Component({
  selector: 'app-staff-dashboard',
  imports: [ProductStatistics, OrderStatistics],
  templateUrl: './staff-dashboard.html',
  styleUrl: './staff-dashboard.css',
})
export class StaffDashboard {}
