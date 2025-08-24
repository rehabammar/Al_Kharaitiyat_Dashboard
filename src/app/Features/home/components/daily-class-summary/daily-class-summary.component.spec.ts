import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyClassSummaryComponent } from './daily-class-summary.component';

describe('DailyClassSummaryComponent', () => {
  let component: DailyClassSummaryComponent;
  let fixture: ComponentFixture<DailyClassSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DailyClassSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyClassSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
