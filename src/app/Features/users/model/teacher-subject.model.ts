export class TeacherSubject {
  teacherSubjectPk?: number;
  teacherFk?: number;
  subjectFk?: number;
  experienceYears?: number | null;
  organizationFk?: number | null;
  stageFk?: number | null;
  createdBy?: number | null;
  creationDate?: string | null;
  modifiedBy?: number | null;
  modifiedDate?: string | null;
  notes?: string | null;

  teacherName?: string;
  subjectName?: string;
  stageName?: string;
  organizationName?: string;

  
  constructor(init?: Partial<TeacherSubject>) {
    Object.assign(this, init);
  }
}
