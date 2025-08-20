export class AcademicTerm {
  academicTermPk?: number;
  termName?: string | null;

  startDate?: string | null;
  endDate?: string | null;

  academicYearFk?: number;
  organizationFk?: number;

  notes?: string | null;

  createdBy?: number;
  creationDate?: string | null;
  modifiedBy?: number;
  modifiedDate?: string | null;

  constructor(init?: Partial<AcademicTerm>) {
    Object.assign(this, init);
  }
}
