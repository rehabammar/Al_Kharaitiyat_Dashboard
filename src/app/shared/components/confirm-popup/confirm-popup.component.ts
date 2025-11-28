


import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogData } from '../../../core/models/confirm-popup-data.interface';
import { TranslateService } from '@ngx-translate/core';

@Component({
  standalone: false,
  selector: 'app-confirm-popup',
  templateUrl: './confirm-popup.component.html',
  styleUrls: ['./confirm-popup.component.css']
})
export class ConfirmPopupComponent implements OnInit, OnDestroy {
  private timer?: any;

  constructor(
    public dialogRef: MatDialogRef<ConfirmPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData,
    private translate: TranslateService
  ) {
    this.data = {
      type: 'confirm',
      ...data
    };
  }

  ngOnInit(): void {
    // auto-close for success/info unless caller overrides
    if ((this.data.type === 'success' || this.data.type === 'info') && this.data.autoCloseMs) {
      this.timer = setTimeout(() => this.popupAction(1), this.data.autoCloseMs);
    }
  }

  ngOnDestroy(): void {
    if (this.timer) clearTimeout(this.timer);
  }

  // computed
  get role(): 'alertdialog' | 'dialog' {
    return this.data.type === 'error' ? 'alertdialog' : 'dialog';
  }
  get ariaLive(): 'assertive' | 'polite' {
    return this.data.type === 'error' ? 'assertive' : 'polite';
  }
  get icon(): string {
    if (this.data.icon) return this.data.icon;
    switch (this.data.type) {
      case 'error': return 'error';
      case 'success': return 'check_circle';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'help';
    }
  }
  get showCancel(): boolean {
    if (this.data.type === 'confirm' || this.data.type === 'warning') {
      return this.data.showCancel !== false; // default true
    }
    return !!this.data.showCancel; // success/info/error default false unless asked
  }
  get okText(): string {
    if (this.data.okLabel) return this.data.okLabel;
    switch (this.data.type) {
      case 'confirm': return 'label.ok';       // i18n keys if you use translate pipe
      case 'warning': return 'label.proceed';
      case 'error': return 'label.close';
      case 'success': return 'label.gotIt';
      default: return 'label.ok';
    }
  }
  get cancelText(): string {
    return this.data.cancelLabel || 'label.cancel';
  }

  popupAction(result: 0 | 1) {
    this.dialogRef.close({ result });
  }

  getLabel(keyOrText?: string, fallbackKey?: string): string {
    if (!keyOrText) return this.translate.instant(fallbackKey ?? '');
    // If it looks like a translation key, translate it
    else {
      return this.translate.instant(keyOrText);
    }

  }

}


