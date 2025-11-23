import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymnetPageComponent } from './paymnet-page.component';

describe('PaymnetPageComponent', () => {
  let component: PaymnetPageComponent;
  let fixture: ComponentFixture<PaymnetPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymnetPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymnetPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
