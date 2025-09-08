import { Role } from './role.model';

export class User {
  userPk?: number;
  firstName?: string;
  secondName?: string;
  thirdName?: string;
  lastName?: string;
  fullName?: string;
  genderFk?: number;
  nationalId?: string;
  dateOfBirth?: Date | null;
  nationalityFk?: number;
  email?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  userTypeFk?: number;
  username?: string;
  password?: string;
  statusFl?: number;
  profilePicturePath?: string;
  organizationFk?: number;
  guardianName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  jobTitle?: string;
  specialization?: string;
  experienceYears?: number;
  educationLevel?: string;
  createdBy?: number;
  creationDate?: Date | null;
  modifiedBy?: number;
  modifiedDate?: Date | null;
  notes?: string;
  roles?: Role[];
  fbToken?: string;
  authToken?: string;
  isActiveFl?: number;
  stageFk?: number;
  stageFkDesc?: string;
  levelFk?: number;
  levelFkDesc?: string;
  profileUrl?: string ;
  teacherScore?: number ;
  averageStars?: number ;

  constructor(init?: Partial<User>) {
    Object.assign(this, init);
  }

}
