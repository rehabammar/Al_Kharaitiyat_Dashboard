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
  phoneNumber1?: string;
  phoneNumber2?: string;
  phoneNumber3?: string;

  
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

  lng?: string;
  lat?: string;

  organizationParentFk?: number;
  aboutUs?: string ;
  ourTarget?: string ;
  androidAppLink?: string ;
  appleAppLink?: string ;

  constructor(data: Partial<Organization> = {}) {
    Object.assign(this, data);
  }
}
