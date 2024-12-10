import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsercourseviewComponent } from './usercourseview.component';

describe('UsercourseviewComponent', () => {
  let component: UsercourseviewComponent;
  let fixture: ComponentFixture<UsercourseviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsercourseviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsercourseviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
