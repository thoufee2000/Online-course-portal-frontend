import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEnrollmentComponent } from './edit-enrollment.component';

describe('EditEnrollmentComponent', () => {
  let component: EditEnrollmentComponent;
  let fixture: ComponentFixture<EditEnrollmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditEnrollmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEnrollmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
