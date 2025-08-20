export class LookupDetail {
  lookupDetailPk?: number;
  lookupFk?: number;

  lookupNameAr?: string;
  lookupNameEn?: string;
  lookupName?: string;

  orderNo?: number;
  activeFl?: number;

  organizationFk?: number | null;
  globalFl?: boolean;

  createdBy?: number;
  creationDate?: Date | null;
  modifiedBy?: number;
  modifiedDate?: Date | null;

  constructor(init?: Partial<LookupDetail>) {
    Object.assign(this, init);
  }
}
