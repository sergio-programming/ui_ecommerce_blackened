import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Shirts } from './shirts';

describe('Shirts', () => {
  let component: Shirts;
  let fixture: ComponentFixture<Shirts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Shirts],
    }).compileComponents();

    fixture = TestBed.createComponent(Shirts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
