import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../../auth/models/user.model';
import { LookupDetail } from '../../../../core/models/lookup-detail.model';

@Component({
  selector: 'app-pay-all-popup',
  standalone: false,
  templateUrl: './pay-all-popup.component.html',
  styleUrl: './pay-all-popup.component.css'
})
export class PayAllPopupComponent {
  constructor(public dialogRef: MatDialogRef<PayAllPopupComponent> ,
  @Inject(MAT_DIALOG_DATA) public data: { selectedTabIndex: number }

  ) { }

  teacherDataFactory = () => new User();
  paymentMethodDataFactory = () => new LookupDetail();


  selectedTeacher?: User | null = null;
  selectedStudent?: User | null = null;
  selectedPaymentMethod: any = null;

  onTeacherSelected(item: User | null) {
    this.selectedTeacher = item;
  }

  onStudentSelected(item: User | null) {
    this.selectedStudent = item;
  }



  onPaymentMethodSelected(event: any): void {
    this.selectedPaymentMethod = event;
  }


  confirm = () => {

    this.dialogRef.close({
      teacher: this.selectedTeacher?.userPk,
      student: this.selectedStudent?.userPk,
      paymentMethod: this.selectedPaymentMethod.lookupDetailPk
    });

  }

  cancel = () => {
    this.dialogRef.close(null);
  }

}
