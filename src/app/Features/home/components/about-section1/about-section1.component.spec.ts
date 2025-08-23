import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutSection1Component } from './about-section1.component';

describe('AboutSection1Component', () => {
  let component: AboutSection1Component;
  let fixture: ComponentFixture<AboutSection1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutSection1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutSection1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
