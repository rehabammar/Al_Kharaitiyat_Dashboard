import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreLoginFooterComponent } from './pre-login-footer.component';

describe('PreLoginFooterComponent', () => {
  let component: PreLoginFooterComponent;
  let fixture: ComponentFixture<PreLoginFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreLoginFooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreLoginFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
