import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyFinancialTransactionsComponent } from './monthly-financial-transactions.component';

describe('MonthlyFinancialTransactionsComponent', () => {
  let component: MonthlyFinancialTransactionsComponent;
  let fixture: ComponentFixture<MonthlyFinancialTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonthlyFinancialTransactionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyFinancialTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
