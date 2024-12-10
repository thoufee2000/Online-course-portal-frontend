import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglecourseviewComponent } from './singlecourseview.component';

describe('SinglecourseviewComponent', () => {
  let component: SinglecourseviewComponent;
  let fixture: ComponentFixture<SinglecourseviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SinglecourseviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SinglecourseviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
