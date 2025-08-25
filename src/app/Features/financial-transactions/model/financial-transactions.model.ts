import { formatUsDateTime, toDate } from "../../../core/util/date-formater";

export class FinancialTransaction {
  notes?: string;

  payeeFk?: number;
  payerFk?: number;
  receiverFk?: number;

  referenceNo?: string;

  amountTeacher?: number;
  amountCenter?: number;
  amountTotal?: number;
  amountRemaining?: number;
  amountPaid?: number;

  paymentDate?: string;

  subjectFk?: number;
  subjectName?: string;

  classTitle?: string;

  transactionTypeFk?: number;
  transactionTypeFkName?: string;

  paymentMethodFk?: number;
  paymentMethodFkName?: string;

  transactionStatusFk?: number;
  transactionStatusFkName?: string;

  centerReceivedMoneyFl?: boolean;
  teacherReceivedMoneyFl?: boolean;

  relatedClassFk?: number;
  relatedCourseFk?: number;
  courseFkName?: string;

  transactionPk?: number;

  organizationFk?: number;
  organizationFkName?: string;

  createdBy?: number;
  createdByName?: string;

  modifiedBy?: number;
  modifiedByName?: string;

  creationDate?: string;
  modifiedDate?: string;

  actualStartDate?: string;

  payeeFkName?: string;
  payerFkName?: string;
  receiverFkName?: string;

  constructor(init?: Partial<FinancialTransaction>) {
  }
}
