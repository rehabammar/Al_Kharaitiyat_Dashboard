import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemLookupsComponent } from './system-lookups.component';

describe('SystemLookupsComponent', () => {
  let component: SystemLookupsComponent;
  let fixture: ComponentFixture<SystemLookupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SystemLookupsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemLookupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
