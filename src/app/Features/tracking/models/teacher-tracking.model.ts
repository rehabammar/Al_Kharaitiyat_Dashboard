export class TeacherTracking {
  teacherUserPk?: number;
  teacherFullName?: string;
  teacherUsername?: string;
  profilePicturePath?: string;
  phoneNumber?: string;

  finishedCount?: number;
  startedCount?: number;
  scheduledCount?: number;
  canceledCount?: number;

  classPk?: number;
  classTitle?: string;
  classStatusFk?: number;

  expectedStartTime?: string;
  expectedEndTime?: string;
  actualStartDate?: string | null;
  actualEndDate?: string | null;

  locationStartLat?: number;
  locationStartLong?: number;
  locationEndLat?: number | null;
  locationEndLong?: number | null;

  teacherStatus?: 'ONLINE' | 'OFFLINE';
  profileUrl?: string;
  genderFk?: number;
  
  selected?: boolean = false;

  constructor(init?: Partial<TeacherTracking>) {}

}
