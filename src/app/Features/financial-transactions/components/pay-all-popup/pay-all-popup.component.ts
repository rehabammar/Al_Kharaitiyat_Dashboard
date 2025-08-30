import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../../auth/models/user.model';
import { LookupDetail } from '../../../../core/models/lookup-detail.model';
import { FinancialTransactionsService } from '../../services/financial-transactions.service';
import { ApiEndpoints } from '../../../../core/constants/api-endpoints';

@Component({
  selector: 'app-pay-all-popup',
  standalone: false,
  templateUrl: './pay-all-popup.component.html',
  styleUrl: './pay-all-popup.component.css'
})
export class PayAllPopupComponent {
  constructor(public dialogRef: MatDialogRef<PayAllPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { selectedTabIndex: number },
    private financialService: FinancialTransactionsService

  ) { }

  teacherDataFactory = () => new User();
  paymentMethodDataFactory = () => new LookupDetail();
  outstandingAmount: number = 0;


  selectedTeacher?: User | null = null;
  selectedStudent?: User | null = null;
  selectedPaymentMethod: any = null;

  onTeacherSelected(item: User | null): void {
    this.selectedTeacher = item;
    if (item) {
      this.financialService.totalOutstandingForUser(item.userPk!, this.data.selectedTabIndex === 0 ? ApiEndpoints.totalOutstandingOnUser() : ApiEndpoints.totalOutstandingForUser()).subscribe({
        next: (amount) => {
          this.outstandingAmount = amount;
        },
        error: (err) => {
          this.outstandingAmount = 0;
        }
      });
    } else {
      this.outstandingAmount = 0;
    }
  }


  onStudentSelected(item: User | null): void {
    this.selectedStudent = item;
    if (item) {
      this.financialService.totalOutstandingForUser(item.userPk! , ApiEndpoints.totalOutstandingOnUser()).subscribe({
        next: (amount) => {
          this.outstandingAmount = amount;
        },
        error: (err) => {
          this.outstandingAmount = 0;
        }
      });
    } else {
      this.outstandingAmount = 0;
    }
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
