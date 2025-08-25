export class Organization{
  organizationsPk?: number;
  organizationName?: string;
  organizationNameAr?: string;
  organizationNameEn?: string;

  licenseNumber?: string;

  countryFk?: number;
  cityFk?: number;

  email?: string;
  phoneNumber?: string;
  whatsappNumber?: string;

  logoUrl?: string;

  statusFl?: number;

  joiningDate?: string;
  expirationDate?: string;

  createdBy?: number;
  creationDate?: string;

  modifiedBy?: number;
  modifiedDate?: string;

  address?: string;

  long?: string;
  lat?: string;

  organizationParentFk?: number;

  constructor(data: Partial<Organization> = {}) {
    Object.assign(this, data);
  }
}
