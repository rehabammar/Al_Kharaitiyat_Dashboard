export class AcademicYear {
  academicYearPk?: number;
  yearName?: string;

  startDate?: string | null;
  endDate?: string | null;

  organizationFk?: number;

  createdBy?: number;
  creationDate?: string | null;
  modifiedBy?: number;
  modifiedDate?: string | null;

  constructor(init?: Partial<AcademicYear>) {
    Object.assign(this, init);
  }
}
