import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStatistics } from './order-statistics';

describe('OrderStatistics', () => {
  let component: OrderStatistics;
  let fixture: ComponentFixture<OrderStatistics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderStatistics],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderStatistics);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
