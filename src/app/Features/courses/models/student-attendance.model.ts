export class StudentAttendance {
  className?: string;
  classFk?: number;

  notes?: string | null;
  teacherReviewComment?: string | null;

  organizationName?: string;
  organizationFk?: number | null;

  attendanceStatusFl?: number | null;
  attendanceStatusName?: string | null;

  studentFk?: number | null;
  studentName?: string | null;

  teacherReview?: number | null;

  createdBy?: number | null;
  creationDate?: string | Date | null;

  modifiedBy?: number | null;
  modifiedDate?: string | Date | null;

  requiredAmount?: number | null;
  paidAmount?: number | null;

  paymentStatusFk?: number | null;
  paymentStatusFL?: number | null;
  paymentStatusName?: string | null;

  studentAttendanceClassPk?: number | null;
  studentAttendanceDate?: string | Date | null;

  constructor(init?: Partial<StudentAttendance>) {
    Object.assign(this, init);
  }
}
