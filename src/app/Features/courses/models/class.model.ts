export class Class {
  paidToCenter?: number;
  locationFk?: number;
  locationEndLong?: number | null;
  paidToTeacher?: number;
  locationEndLat?: number | null;
  puseMints?: number;
  statusName?: string;
  locationName?: string;

  classStatusFk?: number;
  teacherCourseFk?: number;

  classTitle?: string;
  createdBy?: number | null;
  organizationFk?: number;

  actualEndDate?: string | null;
  modifiedDate?: string | null;
  creationDate?: string | null;

  expectedEndTime?: string | null;
  modifiedBy?: number | null;
  actualStartDate?: string | null;

  classPriceTypeFkName?: string | null;
  remindedMeBefore?: number;
  classPriceTypeFk?: number | null;

  actualAmountRequired?: number;
  actualPayedAmount?: number;

  teacherReceivedMoneyFl?: number;
  centerReceivedMoneyFl?: number;

  locationStartLat?: number | null;
  locationStartLong?: number | null;

  teacherCourseName?: string;
  organizationName?: string;

  expectedStartTime?: string | null;

  coursesTeacherFk?: number;
  classPk?: number;

  notes?: string | null;
  classCostForStudent?: number | null;
  teacherFullName?: string;

  centerCarFlag: boolean = false;
  cancelReason?: string | null;
  centerCarCost?: number | null;

  constructor(init?: Partial<Class>) {
    Object.assign(this, init);
  }
}
