// core/models/lookup.model.ts
export class Lookup {
  lookupPk?: number;

  lookupNameAr?: string | null;
  lookupNameEn?: string | null;
  lookupName?: string | null;   

  orderNo?: number | null;
  activeFl?: number | null;    
  globalFl?: boolean | null;

  organizationFk?: number | null;
  organizationName?: string | null;

  notes?: string | null;

  createdBy?: number | null;
  creationDate?: string | null;   
  modifiedBy?: number | null;
  modifiedDate?: string | null;

  constructor(init?: Partial<Lookup>) {
    Object.assign(this, init);
  }
}

