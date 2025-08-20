export class Level {
  levelPk?: number;
  levelName?: string;
  levelNameAr?: string;
  levelNameEn?: string;

  stageFk?: number;
  organizationFk?: number;

  orderNo?: number;
  activeFl?: number;
  notes?: string;

  createdBy?: number;
  creationDate?: Date | null;
  modifiedBy?: number;
  modifiedDate?: Date | null;
  stageName?: string;
  organizationName?: string;

  constructor(init?: Partial<Level>) {
    Object.assign(this, init);
  }
}
