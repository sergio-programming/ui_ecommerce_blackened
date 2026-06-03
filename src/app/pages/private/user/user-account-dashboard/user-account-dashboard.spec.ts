import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountDashboard } from './user-account-dashboard';

describe('UserAccountDashboard', () => {
  let component: UserAccountDashboard;
  let fixture: ComponentFixture<UserAccountDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAccountDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(UserAccountDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
