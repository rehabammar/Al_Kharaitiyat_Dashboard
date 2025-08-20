export class Role {
  rolePk?: number;
  roleNameAr?: string;
  roleNameEn?: string;
  createdBy?: number;
  creationDate?: Date | null;
  modifiedBy?: number;
  modifiedDate?: Date | null;

  constructor(init?: Partial<Role>) {
    Object.assign(this, init);
  }
}
