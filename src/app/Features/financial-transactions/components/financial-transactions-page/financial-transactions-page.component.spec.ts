import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialTransactionsPageComponent } from './financial-transactions-page.component';

describe('FinancialTransactionsPageComponent', () => {
  let component: FinancialTransactionsPageComponent;
  let fixture: ComponentFixture<FinancialTransactionsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialTransactionsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialTransactionsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
