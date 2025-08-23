import { formatUsDateTime, toDate } from "../../../core/util/date-formater";

export class FinancialTransaction {
  // ... your fields unchanged ...
  transactionPk!: number;
  modifiedBy!: number | null;
  creationDate!: Date | null;
  modifiedDate!: Date | null;
  organizationFk!: number;
  createdBy!: number;

  actualStartDate!: Date | null;
  classTitle!: string | null;
  subjectName!: string | null;
  relatedClassFk!: number | null;

  payeeName!: string | null;
  payerName!: string | null;
  receiverName!: string | null;
  payerFk!: number | null;
  payeeFk!: number | null;
  receiverFk!: number | null;

  courseName!: string | null;
  relatedCourseFk!: number | null;
  subjectFk!: number | null;

  amountTotal!: number | null;
  amountPaid!: number | null;
  amountRemaining!: number | null;
  amountCenter!: number | null;
  amountTeacher!: number | null;

  paymentMethodFk!: number | null;
  paymentMethodName!: string | null;

  transactionTypeFk!: number | null;
  transactionTypeName!: string | null;

  transactionStatusFk!: number | null;
  transactionStatusFkName!: string | null;

  paymentDate!: Date | null;

  centerReceivedMoneyFl!: number | null;
  teacherReceivedMoneyFl!: number | null;

  organizationName!: string | null;
  createdByName!: string | null;
  modifiedByName!: string | null;

  referenceNo!: string | null;
  notes!: string | null;

  /** Preferred display settings */
  locale = 'en-US';
  timeZone = 'Africa/Cairo';

  constructor(init?: Partial<FinancialTransaction>) {
    Object.assign(this, init);

    // normalize date-like fields
    this.creationDate     = toDate((init as any)?.creationDate);
    this.modifiedDate     = toDate((init as any)?.modifiedDate);
    this.actualStartDate  = toDate((init as any)?.actualStartDate);
    this.paymentDate      = toDate((init as any)?.paymentDate);
  }

  /** Ready-to-use formatted strings */
  get creationDateFmt(): string {
    return formatUsDateTime(this.creationDate, this.timeZone, this.locale);
  }
  get modifiedDateFmt(): string {
    return formatUsDateTime(this.modifiedDate, this.timeZone, this.locale);
  }
  get actualStartDateFmt(): string {
    return formatUsDateTime(this.actualStartDate, this.timeZone, this.locale);
  }
  get paymentDateFmt(): string {
    return formatUsDateTime(this.paymentDate, this.timeZone, this.locale);
  }

  static fromApi(raw: any): FinancialTransaction {
    return new FinancialTransaction(raw);
  }

  toApi(): any {
    return {
      ...this,
      // Note: toISOString() is UTC (Z). If your API expects "+03:00",
      // send the original string from API instead, or format with offset.
      creationDate: this.creationDate?.toISOString() ?? null,
      modifiedDate: this.modifiedDate?.toISOString() ?? null,
      actualStartDate: this.actualStartDate?.toISOString() ?? null,
      paymentDate: this.paymentDate?.toISOString() ?? null,
    };
  }
}
