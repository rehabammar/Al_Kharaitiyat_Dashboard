import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassesTimelineByTeacherComponent } from './classes-timeline-by-teacher.component';

describe('ClassesTimelineByTeacherComponent', () => {
  let component: ClassesTimelineByTeacherComponent;
  let fixture: ComponentFixture<ClassesTimelineByTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClassesTimelineByTeacherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassesTimelineByTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
