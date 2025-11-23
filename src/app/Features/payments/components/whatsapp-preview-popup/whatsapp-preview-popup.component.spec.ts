import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappPreviewPopupComponent } from './whatsapp-preview-popup.component';

describe('WhatsappPreviewPopupComponent', () => {
  let component: WhatsappPreviewPopupComponent;
  let fixture: ComponentFixture<WhatsappPreviewPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WhatsappPreviewPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhatsappPreviewPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
