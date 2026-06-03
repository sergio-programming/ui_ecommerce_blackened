import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEditingForm } from './user-editing-form';

describe('UserEditingForm', () => {
  let component: UserEditingForm;
  let fixture: ComponentFixture<UserEditingForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserEditingForm],
    }).compileComponents();

    fixture = TestBed.createComponent(UserEditingForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
