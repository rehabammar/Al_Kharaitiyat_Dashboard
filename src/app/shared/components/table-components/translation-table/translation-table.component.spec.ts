import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslationTableComponent } from './translation-table.component';

describe('TranslationTableComponent', () => {
  let component: TranslationTableComponent;
  let fixture: ComponentFixture<TranslationTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TranslationTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TranslationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
