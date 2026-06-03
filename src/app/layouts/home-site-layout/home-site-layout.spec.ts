import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSiteLayout } from './home-site-layout';

describe('HomeSiteLayout', () => {
  let component: HomeSiteLayout;
  let fixture: ComponentFixture<HomeSiteLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeSiteLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeSiteLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
