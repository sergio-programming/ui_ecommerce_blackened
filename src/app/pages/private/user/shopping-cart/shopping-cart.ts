import { Component } from '@angular/core';
import { ShoppingCartList } from '../../../../features/cart/shopping-cart-list/shopping-cart-list';

@Component({
  selector: 'app-shopping-cart',
  imports: [ShoppingCartList],
  templateUrl: './shopping-cart.html',
  styleUrl: './shopping-cart.css',
})
export class ShoppingCart {}
