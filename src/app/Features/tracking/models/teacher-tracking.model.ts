export class TeacherTracking {
  teacherUserPk?: number;
  genderFk?: number;

  teacherFullName?: string;
  teacherUsername?: string;
  profilePicturePath?: string;
  profileUrl?: string;
  phoneNumber?: string;

  finishedCount?: number;
  startedCount?: number;
  scheduledCount?: number;
  canceledCount?: number;
  totalToday?: number;

  classPk?: number;
  classTitle?: string;
  classStatusFk?: number;

  expectedStartTime?: string;
  expectedEndTime?: string;
  actualStartDate?: string | null;
  actualEndDate?: string | null;

  locationStartLat?: number | null;
  locationStartLong?: number | null;
  locationEndLat?: number | null;
  locationEndLong?: number | null;

  teacherStatus?: string;

  selected: boolean = false;

  constructor(init?: Partial<TeacherTracking>) {
    Object.assign(this, init);
  }
}
