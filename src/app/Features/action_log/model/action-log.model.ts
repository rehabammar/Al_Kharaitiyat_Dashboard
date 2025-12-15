export class ActionLog {

  actionLogPk!: number | null;

  // User info
  userFk!: number | null;
  username!: string | null;
  fullName!: string | null;

  // Action info
  actionType!: string | null;          // INSERT / UPDATE / DELETE / LOGIN
  tableName!: string | null;
  recordId!: number | null;

  // Data snapshot
  oldData!: string | null;             // JSON (before)
  newData!: string | null;             // JSON (after)
  sqlQuery!: string | null;

  // Request info
  ipAddress!: string | null;
  userAgent!: string | null;

  // Organization (multi-tenant)
  organizationFk!: number | null;
  organizationFkName!: string | null;

  // Audit fields
  createdBy!: number | null;
  creationDate!: string | null;
  modifiedBy!: number | null;
  modifiedDate!: string | null;

  constructor(init?: Partial<ActionLog>) {
    Object.assign(this, init);
  }
}
