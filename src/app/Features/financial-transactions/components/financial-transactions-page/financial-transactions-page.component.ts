import { Component, ViewChild } from '@angular/core';
import { TableColumn } from '../../../../core/models/table-column.interface';
import { FinancialTransaction } from '../../model/financial-transactions.model';
import { GenericTableComponent } from '../../../../shared/components/table-components/generic-table/generic-table.component';
import { LookupDetail } from '../../../../core/models/lookup-detail.model';

@Component({
  selector: 'app-financial-transactions-page',
  standalone: false,
  templateUrl: './financial-transactions-page.component.html',
  styleUrl: './financial-transactions-page.component.css'
})
export class FinancialTransactionsPageComponent {
@ViewChild('financialTransactionTable') table!: GenericTableComponent<FinancialTransaction>;


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
    labelKey: 'FinancialTransactions.PayerName',
    field: 'payerFkName',
    required: false,
    dataType: 'string',
    disabled: true,
    width: '220px',
  },
  {
    labelKey: 'FinancialTransactions.PayeeName',
    field: 'payeeFkName',
    required: false,
    dataType: 'string',
    disabled: true,
    width: '220px',
  },
  {
    labelKey: 'FinancialTransactions.PaymentDate',
    field: 'paymentDate',
    required: true,
    dataType: 'date',
    disabled: false,
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
    field: 'paymentMethodFkName',
    fieldFK:'paymentMethodFk',
    required: true,
    showInTable: false ,
    dataType: 'string',
    disabled: false,
    isCombobox: true,
    apiPath: '/lookupDetails/payment-type',
    displayItemKey: 'lookupName',
    primaryKey: 'lookupDetailPk',
    dataFactory: () => new LookupDetail(),
    width: '130px',
  },
  {
    labelKey: 'FinancialTransactions.Status',
    field: 'transactionStatusFkName',
    fieldFK: 'transactionStatusFk',
    required: true,
    dataType: 'string',
    disabled: false,
    isCombobox: true,
    apiPath: '/lookupDetails/payment-status',
    displayItemKey: 'lookupName',
    primaryKey: 'lookupDetailPk',
    dataFactory: () => new LookupDetail(),
    width: '120px',
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

   {
    labelKey: 'Class.PaidToTeacher',
    field: 'teacherReceivedMoneyFl',
    required: true,
    dataType: 'number',
    disabled: false,
    isFlag: true ,
    width: '150px',
  },
  {
    labelKey: 'Class.PaidToCenter',
    field: 'centerReceivedMoneyFl',
    required: true,
    dataType: 'number',
    disabled: false,
    isFlag: true ,
    width: '150px',
  },
  {
    labelKey: 'TeacherCourse.Name',
    field: 'courseFkName',
    required: false,
    dataType: 'string',
    disabled: true,
    width: '240px',
  },
    {
    labelKey: 'FinancialTransactions.ClassTitle',
    field: 'classTitle',
    required: false,
    dataType: 'string',
    disabled: true,
    width: '240px',
    showInTable : false ,
  },
  // {
  //   labelKey: 'FinancialTransactions.SubjectName',
  //   field: 'subjectName',
  //   required: false,
  //   dataType: 'string',
  //   disabled: true,
  //   width: '180px',
  // },

  // {
  //   labelKey: 'FinancialTransactions.ReferenceNo',
  //   field: 'referenceNo',
  //   required: false,
  //   dataType: 'string',
  //   disabled: true,
  //   width: '160px',
  // },
  // {
  //   labelKey: 'FinancialTransactions.Notes',
  //   field: 'notes',
  //   required: false,
  //   dataType: 'string',
  //   disabled: false,
  //   width: '280px',
  // },
];


  selectedFinancialTransactions: FinancialTransaction | null = null;
  onTransactionSelected(row: FinancialTransaction) {
    this.selectedFinancialTransactions = row;
  }

  onTransactionRowChanged(e: { field: string; value: any }) {
    if (!this.selectedFinancialTransactions) return;
    this.selectedFinancialTransactions = {
      ...this.selectedFinancialTransactions,
      [e.field]: e.value
    };

    const id = this.selectedFinancialTransactions.transactionPk;
    this.table.patchRowById(id, { [e.field]: e.value } as Partial<FinancialTransaction>);
  }

  onTransactionSaved(row: FinancialTransaction) {
    this.table.patchRowById(row.transactionPk, row);
  }

  onNewTransactionRow(row: FinancialTransaction) {
    this.selectedFinancialTransactions = row;
    this.table.prependRow(row);
  }

  onTeacherCourseRowDeleted(e: { type: 'new' | 'persisted'; id?: any; row?: any }) {
    if (e.type === 'new') {
      this.table.removeRow(e.row);
    } else {
      this.table.removeRow(e.id);
    }
    this.selectedFinancialTransactions = null;
  }



}
