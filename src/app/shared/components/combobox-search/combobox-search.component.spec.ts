import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComboboxSearchComponent } from './combobox-search.component';

describe('ComboboxSearchComponent', () => {
  let component: ComboboxSearchComponent;
  let fixture: ComponentFixture<ComboboxSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComboboxSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComboboxSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
