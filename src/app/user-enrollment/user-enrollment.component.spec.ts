import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEnrollmentComponent } from './user-enrollment.component';

describe('UserEnrollmentComponent', () => {
  let component: UserEnrollmentComponent;
  let fixture: ComponentFixture<UserEnrollmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserEnrollmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserEnrollmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
