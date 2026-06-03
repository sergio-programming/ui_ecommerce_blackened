import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingCartList } from './shopping-cart-list';

describe('ShoppingCartList', () => {
  let component: ShoppingCartList;
  let fixture: ComponentFixture<ShoppingCartList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShoppingCartList],
    }).compileComponents();

    fixture = TestBed.createComponent(ShoppingCartList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
