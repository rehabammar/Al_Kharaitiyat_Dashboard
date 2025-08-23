import { Component } from '@angular/core';
import { TableColumn } from '../../../../core/models/table-column.interface';
import { FinancialTransaction } from '../../model/financial-transactions.model';

@Component({
  selector: 'app-financial-transactions-page',
  standalone: false,
  templateUrl: './financial-transactions-page.component.html',
  styleUrl: './financial-transactions-page.component.css'
})
export class FinancialTransactionsPageComponent {


  financialTransactionDataFactory = () => new FinancialTransaction();

 financialTransactionsColumns: TableColumn[] = [
  {
    labelKey: 'FinancialTransactions.TransactionPk',
    field: 'transactionPk',
    required: false,
    dataType: 'number',
    disabled: true,
    width: '110px',
  },
  {
    labelKey: 'FinancialTransactions.PaymentDate',
    field: 'paymentDate',
    required: false,
    dataType: 'date',
    disabled: true,
    width: '150px',
  },

  // {
  //   labelKey: 'FinancialTransactions.TransactionType',
  //   field: 'transactionTypeName',
  //   required: false,
  //   dataType: 'string',
  //   disabled: true,
  //   width: '140px',
  // },
  {
    labelKey: 'FinancialTransactions.PaymentMethod',
    field: 'paymentMethodName',
    required: false,
    dataType: 'string',
    disabled: true,
    width: '130px',
  },
  {
    labelKey: 'FinancialTransactions.Status',
    field: 'transactionStatusFkName',
    required: false,
    dataType: 'string',
    disabled: true,
    width: '120px',
  },

  {
    labelKey: 'FinancialTransactions.PayerName',
    field: 'payerName',
    required: false,
    dataType: 'string',
    disabled: true,
    width: '220px',
  },
  {
    labelKey: 'FinancialTransactions.PayeeName',
    field: 'payeeName',
    required: false,
    dataType: 'string',
    disabled: true,
    width: '220px',
  },
  // {
  //   labelKey: 'FinancialTransactions.ReceiverName',
  //   field: 'receiverName',
  //   required: false,
  //   dataType: 'string',
  //   disabled: true,
  //   width: '250px'
  // },

  {
    labelKey: 'FinancialTransactions.AmountTotal',
    field: 'amountTotal',
    required: false,
    dataType: 'number',
    disabled: true,
    width: '120px',
  },
  {
    labelKey: 'FinancialTransactions.AmountPaid',
    field: 'amountPaid',
    required: false,
    dataType: 'number',
    disabled: true,
    width: '170px'
  },
  {
    labelKey: 'FinancialTransactions.AmountRemaining',
    field: 'amountRemaining',
    required: false,
    dataType: 'number',
    disabled: true,
    width: '140px',
  },

  // {
  //   labelKey: 'FinancialTransactions.OrganizationName',
  //   field: 'organizationName',
  //   required: false,
  //   dataType: 'string',
  //   disabled: true,
  //   width: '220px',
  // },
  {
    labelKey: 'FinancialTransactions.ClassTitle',
    field: 'classTitle',
    required: false,
    dataType: 'string',
    disabled: true,
    width: '240px',
  },
  {
    labelKey: 'FinancialTransactions.CourseName',
    field: 'courseName',
    required: false,
    dataType: 'string',
    disabled: true,
    width: '240px',
  },
  {
    labelKey: 'FinancialTransactions.SubjectName',
    field: 'subjectName',
    required: false,
    dataType: 'string',
    disabled: true,
    width: '180px',
  },

  {
    labelKey: 'FinancialTransactions.ReferenceNo',
    field: 'referenceNo',
    required: false,
    dataType: 'string',
    disabled: true,
    width: '160px',
  },
  {
    labelKey: 'FinancialTransactions.Notes',
    field: 'notes',
    required: false,
    dataType: 'string',
    disabled: false,
    width: '280px',
  },
];


}
