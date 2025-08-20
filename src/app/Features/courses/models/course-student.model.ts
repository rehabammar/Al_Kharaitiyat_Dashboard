export class CourseStudent {
  courseStudentPk?: number;

  studentFk?: number | null;
  teacherCourseFk?: number | null;

  courseStatusFk?: number | null;
  joinStatusFk?: number | null;

  courseStudentRegistrationDate?: string | null; // ISO string from API
  attendanceStatusFl?: 0 | 1 | null;

  organizationFk?: number | null;

  createdBy?: number | null;
  creationDate?: string | null;
  modifiedBy?: number | null;
  modifiedDate?: string | null;

  notes?: string | null;

  studentFullName?: string | null;
  teacherCourseName?: string | null;
  joinStatusFkDesc?: string | null;
  organizationName?: string | null;

  constructor(init?: Partial<CourseStudent>) {
    Object.assign(this, init);
  }
}

