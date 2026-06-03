import { TestBed } from '@angular/core/testing';

import { LocalStorageServices } from './local-storage-services';

describe('LocalStorageServices', () => {
  let service: LocalStorageServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
