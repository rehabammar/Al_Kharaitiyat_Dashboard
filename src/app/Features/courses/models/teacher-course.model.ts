export class TeacherCourse {
  // === DB fields ===
  teacherCoursePk?: number;
  teacherCourseName?: string;

  academicYearFk?: number;
  academicTermFk?: number;

  coursesTeacherFk?: number;   // required by backend, optional here
  coursesSubjectFk?: number;   // required by backend

  levelFk?: number;
  stageFk?: number;

  courseTypeFk?: number;       // required by backend
  courseStatusFk?: number;

  actualStudentsCount?: number;
  coursePrice?: number;        // BigDecimal -> number
  priceTypeFk?: number;
  maxStudents?: number;
  durationMinutes?: number | null;
  centerPercentage?: number;   // BigDecimal -> number

  organizationFk?: number;
  notes?: string;

  createdBy?: number;
  creationDate?: Date | null;
  modifiedBy?: number;
  modifiedDate?: Date | null;

  // === Display-only fields from API (read-only) ===
  priceTypeFkName?: string;
  academicYearName?: string;
  academicTermName?: string;
  courseTypeName?: string;
  courseStatusName?: string;
  levelName?: string;
  stageName?: string;
  teacherName?: string;
  subjectName?: string;
  organizationName?: string;

  constructor(init?: Partial<TeacherCourse>) {
    Object.assign(this, init);
  }

}