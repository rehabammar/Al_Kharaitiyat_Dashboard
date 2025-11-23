import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { TableColumn } from '../../../../core/models/table-column.interface';
import { FinancialTransaction } from '../../model/financial-transactions.model';
import { GenericTableComponent } from '../../../../shared/components/table-components/generic-table/generic-table.component';
import { LookupDetail } from '../../../../core/models/lookup-detail.model';
import { ButtonVisibilityConfig } from '../../../../core/models/button-visibility-config.interface';
import { MatDialog } from '@angular/material/dialog';
import { PayAllPopupComponent } from '../pay-all-popup/pay-all-popup.component';
import { FinancialTransactionsService } from '../../services/financial-transactions.service';

@Component({
  selector: 'app-financial-transactions-page',
  standalone: false,
  templateUrl: './financial-transactions-page.component.html',
  styleUrl: './financial-transactions-page.component.css'
})
export class FinancialTransactionsPageComponent implements OnInit {

  @ViewChild('centerTable') centerTable!: GenericTableComponent<FinancialTransaction>;
  @ViewChild('teacherTable') teacherTable!: GenericTableComponent<FinancialTransaction>;
  @ViewChild('studentsTable') studentsTable!: GenericTableComponent<FinancialTransaction>;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private transactionsService: FinancialTransactionsService) { }
  financialTransactionDataFactory = () => new FinancialTransaction();

  orgnizationId: number = 1;
  activeTabIndex = 0;

  updatePath = 'pay-single-transaction';



  ngOnInit(): void {
    this.setColumnsForTab(0); // Default to tab 0
    // const org = SessionStorageUtil.getItem<any>(AppConstants.CURRENT_ORGNIZATION_KEY);

    // if (org) {
    //   this.orgnizationId = org.orgnizationPk;
    //}
    // this.changeDetectorRef.markForCheck();

  }

  buttonVisibility: ButtonVisibilityConfig = {
    showDelete: false,
    showInsert: false,
    showSave: true,
  };

  baseColumns: TableColumn[] = [
    {
      labelKey: 'FinancialTransactions.TransactionPk',
      field: 'transactionPk',
      required: false,
      dataType: 'number',
      disabled: true,
      width: '100px',
    },

    {
      labelKey: 'FinancialTransactions.PayerName',
      field: 'payerFkName',
      required: false,
      dataType: 'string',
      disabled: true,
      width: '200px',
    },

    {
      labelKey: 'FinancialTransactions.PayeeName',
      field: 'payeeFkName',
      required: false,
      dataType: 'string',
      disabled: true,
      width: '200px',
    },
    {
      labelKey: 'FinancialTransactions.ReceiverName',
      field: 'receiverFkName',
      required: false,
      dataType: 'string',
      disabled: true,
      width: '200px',
    },
    {
      labelKey: 'TeacherCourse.Name',
      field: 'courseFkName',
      required: false,
      dataType: 'string',
      disabled: true,
      width: '240px',
      showInTable: false,
    },
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
    {
      labelKey: 'FinancialTransactions.PaymentDate',
      field: 'paymentDate',
      required: false,
      dataType: 'datetime',
      disabled: true,
      width: '130px',
    },

    {
      labelKey: 'FinancialTransactions.TransactionType',
      field: 'transactionTypeFkName',
      required: false,
      dataType: 'string',
      disabled: true,
      showTotalLabel: true,
      width: '140px',
    },
    {
      labelKey: 'FinancialTransactions.PaymentMethod',
      field: 'paymentMethodFkName',
      fieldFK: 'paymentMethodFk',
      required: true,
      showInTable: false,
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
      required: false,
      dataType: 'string',
      disabled: true,
      showInTable: false,
      // isCombobox: true,
      // apiPath: '/lookupDetails/payment-status',
      // displayItemKey: 'lookupName',
      // primaryKey: 'lookupDetailPk',
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
      dataType: 'currency',
      disabled: true,
      width: '120px',
      showInTable: false,
    },
    {
      labelKey: 'FinancialTransactions.AmountPaid',
      field: 'amountPaid',
      required: false,
      dataType: 'currency',
      disabled: true,
      width: '120px',
      showTotalAmountPaid: true,
    },
    {
      labelKey: 'FinancialTransactions.AmountRemaining',
      field: 'amountRemaining',
      required: false,
      dataType: 'currency',
      disabled: true,
      width: '120px',
      showTotalAmountRemaining: true,
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


  centerPaidColumn: TableColumn = {
    labelKey: 'Class.PaidToCenter',
    field: 'centerReceivedMoneyFl',
    required: false,
    dataType: 'number',
    disabled: true,
    isFlag: true,
    width: '100px',
  };

  teacherPaidColumn: TableColumn = {
    labelKey: 'Class.PaidToTeacher',
    field: 'teacherReceivedMoneyFl',
    required: false,
    dataType: 'number',
    disabled: true,
    isFlag: true,
    width: '100px',
  };
  studentPaidColumn: TableColumn = {
    labelKey: 'Class.Paid',
    field: 'studentPaidFl',
    required: false,
    dataType: 'number',
    disabled: true,
    isFlag: true,
    width: '100px',
  };



  financialTransactionsColumns: TableColumn[] = [];

  setColumnsForTab(tabIndex: number) {
    if (tabIndex === 0) {
      this.financialTransactionsColumns = [...this.baseColumns, this.centerPaidColumn];
    } else if (tabIndex === 1) {
      this.financialTransactionsColumns = [...this.baseColumns, this.teacherPaidColumn];
    } else {
      this.financialTransactionsColumns = [...this.baseColumns, this.studentPaidColumn];
    }
    this.changeDetectorRef.markForCheck();
  }
  setUpdatePathForTab(tabIndex: number) {
    if (tabIndex === 0) {
      this.updatePath = 'pay-single-transaction';
    } else if (tabIndex === 1) {
      this.updatePath = 'pay-single-transaction-from-teacher';
    } else {
      this.updatePath = 'pay-single-transaction-from-student';
    }
  }

  onTabChange(event: any) {
    this.activeTabIndex = event.index;
    this.setColumnsForTab(event.index);
    this.setUpdatePathForTab(event.index);
    // this.selectedFinancialTransactions = null;
    // this.buttonVisibility = { showDelete: false, showInsert: false, showSave: true };
    this.changeDetectorRef.markForCheck();

  }


  private get currentTable(): GenericTableComponent<FinancialTransaction> | null {
    if (this.activeTabIndex === 0) return this.centerTable || null;
    if (this.activeTabIndex === 1) return this.teacherTable || null;
    return this.studentsTable || null;
  }

  selectedFinancialTransactions: FinancialTransaction | null = null;

  onTransactionSelected(row?: FinancialTransaction | null) {
    const defaultVisibility: ButtonVisibilityConfig = {
      showDelete: false,
      showInsert: false,
      showSave: true,
    };

    if (!row) {
      this.selectedFinancialTransactions = null;
      this.buttonVisibility = defaultVisibility;
      this.changeDetectorRef.markForCheck();
      return;
    }

    this.selectedFinancialTransactions = row;

    const toBool = (v: any) => v === true || v === 1 || v === '1';

    let v = { ...defaultVisibility };

    if (this.activeTabIndex === 0 && toBool(row.centerReceivedMoneyFl)) {
      v = { ...defaultVisibility, showSave: false };
    } else if (this.activeTabIndex === 1 && toBool(row.teacherReceivedMoneyFl)) {
      v = { ...defaultVisibility, showSave: false };
    } else if (this.activeTabIndex === 2 && toBool(row.studentPaidFl)) {
      v = { ...defaultVisibility, showSave: false };
    }

    if (row.paymentMethodFk == null) {
      row.paymentMethodFk = 68;

    }

    this.buttonVisibility = v;
    this.changeDetectorRef.markForCheck();
  }




  onTransactionRowChanged(e: { field: string; value: any }) {
    if (!this.selectedFinancialTransactions) return;
    this.selectedFinancialTransactions = {
      ...this.selectedFinancialTransactions,
      [e.field]: e.value
    };
    const id = this.selectedFinancialTransactions.transactionPk;
    this.currentTable?.patchRowById(id, { [e.field]: e.value } as Partial<FinancialTransaction>);
  }

  onTransactionSaved(row: FinancialTransaction) {
    this.currentTable?.patchRowById(row.transactionPk, row);
    this.centerTable?.loadData();
  }

  onNewTransactionRow(row: FinancialTransaction) {
    this.selectedFinancialTransactions = row;
    this.currentTable?.prependRow(row);
  }

  onTransactioDeleted(e: { type: 'new' | 'persisted'; id?: any; row?: any }) {
    if (e.type === 'new') {
      this.currentTable?.removeRow(e.row);
    } else {
      this.currentTable?.removeRow(e.id);
    }
    this.selectedFinancialTransactions = null;
  }



  openPayAllPopup = () => {

    const dialogRef = this.dialog.open(PayAllPopupComponent, {
      width: '400px',
      data: { selectedTabIndex: this.activeTabIndex }
    });

    const requestBoy = {
    }

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let requestBody: any = {};

        if (this.activeTabIndex === 0) {
          requestBody = {
            payerFk: result.teacher,
            payeeFk: this.orgnizationId,
            paymentMethodFk: result.paymentMethod
          };
        } else if (this.activeTabIndex === 1) {
          requestBody = {
            payerFk: this.orgnizationId,
            payeeFk: result.teacher,
            paymentMethodFk: result.paymentMethod
          };
        } else {

          requestBody = {
            payerFk: result.student,
            payeeFk: this.orgnizationId,
            paymentMethodFk: result.paymentMethod
          };
        }

        if (this.activeTabIndex === 2) {
          this.transactionsService.payAllFinancialTransactionsforStudent(requestBody).subscribe({
            next: (res) => {
              this.currentTable?.loadData();
            },
            error: (err) => {
              // console.error('Error paying transactions:', err);
            }
          });
          return;
        } else if (this.activeTabIndex === 1) {
          this.transactionsService.payAllFinancialTransactionsforTeacher(requestBody).subscribe({
            next: (res) => {
              this.currentTable?.loadData();
            },
            error: (err) => {
              console.error('Error paying transactions:', err);
            }
          });
          return;

        }
        this.transactionsService.payAllTransactions(requestBody).subscribe({
          next: (res) => {
            this.currentTable?.loadData();
          },
          error: (err) => {
            console.error('Error paying transactions:', err);
          }
        });
      }
    });
  }

}
