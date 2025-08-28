import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayAllPopupComponent } from './pay-all-popup.component';

describe('PayAllPopupComponent', () => {
  let component: PayAllPopupComponent;
  let fixture: ComponentFixture<PayAllPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayAllPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayAllPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
