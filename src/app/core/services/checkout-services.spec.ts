import { TestBed } from '@angular/core/testing';

import { CheckoutServices } from './checkout-services';

describe('CheckoutServices', () => {
  let service: CheckoutServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckoutServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
