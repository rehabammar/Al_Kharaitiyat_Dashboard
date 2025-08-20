import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmPopupData } from '../../../core/models/confirm-popup-data.interface';
@Component({
  selector: 'lib-confirm-popup',
  standalone: false ,
  templateUrl: './confirm-popup.component.html',
  styleUrl: './confirm-popup.component.css'
})
export class ConfirmPopupComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmPopupData
  ) {}

  popupAction(result: number | null): void {
    this.dialogRef.close({ result });
  }
}



