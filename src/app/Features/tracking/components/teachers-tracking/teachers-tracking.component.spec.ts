import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachersTrackingComponent } from './teachers-tracking.component';

describe('TeachersTrackingComponent', () => {
  let component: TeachersTrackingComponent;
  let fixture: ComponentFixture<TeachersTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeachersTrackingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeachersTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
