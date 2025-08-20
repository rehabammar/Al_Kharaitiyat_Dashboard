export class Stage {
  // === DB fields ===
  stagePk?: number;

  stageName?: string;
  stageNameAr?: string;
  stageNameEn?: string;

  orderNo?: number;
  activeFl?: number;

  notes?: string | null;

  organizationFk?: number;
  organizationNameAr?: string;
  organizationNameEn?: string;

  createdBy?: number;
  creationDate?: string | null;
  modifiedBy?: number;
  modifiedDate?: string | null;

  constructor(init?: Partial<Stage>) {
    Object.assign(this, init);
  }
}
