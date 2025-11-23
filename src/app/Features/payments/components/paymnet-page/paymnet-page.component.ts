import { Component } from '@angular/core';
import { TableColumn } from '../../../../core/models/table-column.interface';
import { LookupDetail } from '../../../../core/models/lookup-detail.model';
import { FinancialTransaction } from '../../../financial-transactions/model/financial-transactions.model';

@Component({
  selector: 'app-paymnet-page',
  standalone: false,
  templateUrl: './paymnet-page.component.html',
  styleUrl: './paymnet-page.component.css'
})
export class PaymnetPageComponent {


  OUTSTANDING: number = 81;

  financialTransactionDataFactory = () => new FinancialTransaction();

  financialTransactionsColumns: TableColumn[] = [
    {
      labelKey: 'FinancialTransactions.TransactionPk',
      field: 'transactionPk',
      required: false,
      dataType: 'number',
      disabled: true,
      width: '100px',
    },
    {
      labelKey: 'payment.studentId',
      field: 'payerFk',
      required: false,
      dataType: 'string',
      disabled: true,
      width: '200px',
    },
    {
      labelKey: 'payment.student',
      field: 'payerFkName',
      required: false,
      dataType: 'string',
      disabled: true,
      width: '200px',
    },
    {
      labelKey: 'payment.teacherId',
      field: 'coursesTeacherFk',
      required: false,
      dataType: 'string',
      disabled: true,
      width: '200px',
    },
    {
      labelKey: 'payment.teacher',
      field: 'teacherFkName',
      required: false,
      dataType: 'string',
      disabled: true,
      width: '200px',
    },

    // {
    //   labelKey: 'FinancialTransactions.PayeeName',
    //   field: 'payeeFkName',
    //   required: false,
    //   dataType: 'string',
    //   disabled: true,
    //   width: '200px',
    // },
    // {
    //   labelKey: 'FinancialTransactions.ReceiverName',
    //   field: 'receiverFkName',
    //   required: false,
    //   dataType: 'string',
    //   disabled: true,
    //   width: '200px',
    // },
    // {
    //   labelKey: 'TeacherCourse.Name',
    //   field: 'courseFkName',
    //   required: false,
    //   dataType: 'string',
    //   disabled: true,
    //   width: '240px',
    //   showInTable: false,
    // },
    {
      labelKey: 'Class.ClassPk',
      field: 'relatedClassFk',
      required: false,
      dataType: 'number',
      disabled: true,
      width: '200px'
    },
    {
      labelKey: 'FinancialTransactions.ClassTitle',
      field: 'classTitle',
      required: false,
      dataType: 'string',
      disabled: true,
      width: '240px',
      showInTable: false,
    },
    // {
    //   labelKey: 'FinancialTransactions.PaymentDate',
    //   field: 'paymentDate',
    //   required: false,
    //   dataType: 'datetime',
    //   disabled: true,
    //   width: '130px',
    // },


    // {
    //   labelKey: 'FinancialTransactions.AmountTotal',
    //   field: 'amountTotal',
    //   required: false,
    //   dataType: 'currency',
    //   disabled: true,
    //   width: '120px',
    //   showInTable: false,
    // },
    // {
    //   labelKey: 'FinancialTransactions.AmountPaid',
    //   field: 'amountPaid',
    //   required: false,
    //   dataType: 'currency',
    //   disabled: true,
    //   width: '120px',
    //   showTotalAmountPaid: true,
    // },
    {
      labelKey: 'FinancialTransactions.AmountRemaining',
      field: 'amountRemaining',
      required: false,
      dataType: 'currency',
      disabled: true,
      width: '120px',
      showTotalAmountRemaining: true,
    },
    {
      labelKey: 'payment.pay',
      field: 'selected',
      required: false,
      dataType: 'number',
      disabled: false,
      width: '100px',
      isCheckbox: true,

    },
    {
      labelKey: 'payment.mobile',
      field: 'whatsappNumber',
      dataType: 'string',
      disabled: true,
      width: '150px' ,
      showInTable: false,
    },
     {
      labelKey: 'payment.mobile',
      field: 'actualStartDate',
      dataType: 'string',
      disabled: true,
      width: '150px' ,
      showInTable: false,
    }




  ];


  onStudentToggle(row: any, selected: boolean) {
    row.amountPaid = selected ? (row.amountTotal ?? 0) : 0;
  }


}
