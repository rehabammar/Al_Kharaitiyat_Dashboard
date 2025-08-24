import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterStatisticsComponent } from './center-statistics.component';

describe('CenterStatisticsComponent', () => {
  let component: CenterStatisticsComponent;
  let fixture: ComponentFixture<CenterStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CenterStatisticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CenterStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
