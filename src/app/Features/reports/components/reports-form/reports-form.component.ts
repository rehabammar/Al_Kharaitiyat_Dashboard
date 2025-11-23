import { ChangeDetectorRef, Component } from '@angular/core';
import { ReportsService } from '../../services/reports.service';
import { ReportsType } from '../../services/reports-type';
import { ApiEndpoints } from '../../../../core/constants/api-endpoints';
import { UserService } from '../../../auth/services/user.service';
import { User } from '../../../auth/models/user.model';
import { TeacherCourse } from '../../../courses/models/teacher-course.model';
import { Observable } from 'rxjs/internal/Observable';
import { SearchDialogComponent } from '../../../../shared/components/search-dialog/search-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { map, take } from 'rxjs';

enum UserSearchType {
  Teacher,
  Student,
  User
}

@Component({
  selector: 'app-reports-form',
  standalone: false,
  templateUrl: './reports-form.component.html',
  styleUrl: './reports-form.component.css'
})
export class ReportsFormComponent {

  startDate: string ="";
  endDate: string ="";

  selectedTeacher : User | null = null ;
  selectedStudent : User | null = null ;
  selectedUser : User | null = null ;


  selectedCourse : TeacherCourse | null = null ;

  reportType!: ReportsType ;
  downloading = false;

   ApiEndpoints = ApiEndpoints ;
   UserSearchType = UserSearchType ;



  constructor(
    private reports: ReportsService ,
    private dialog:MatDialog , 
    private dir : ChangeDetectorRef) {}

  courseDataFactory = () => new TeacherCourse();
  userDataFactory = () => new User();
  

dateOnly(s?: string | null): string {
  if (!s) return '';
  return s.includes('T') ? s.slice(0, 10) : s;
}

// make it an arrow function:
onDownloadReports = async () => {
  const start = this.dateOnly(this.startDate);
  const end   = this.dateOnly(this.endDate);

  this.downloading = true;
  try {
    await this.reports.downloadReport({
      type: this.reportType as any,
      // if service expects Date, convert string (YYYY-MM-DD) to Date:
      startDate: start ,
      endDate:   end  ,
      openAfterDownload: true,
      teacherId: this.selectedTeacher?.userPk,
      studentId: this.selectedStudent?.userPk,
      userId: this.selectedUser?.userPk,
      courseId:  this.selectedCourse?.teacherCoursePk ,
    });
  } finally {
    this.downloading = false;
  }

  
};
 

 openUsersSearchDialog(apiPath : string , userSearchType : UserSearchType): void {
  const dialogRef = this.dialog.open(SearchDialogComponent, {
    maxWidth: '80vw',
    width: '50vw',
    data: {
      apiEndpoint: apiPath,
      columns: [
        {
          labelKey: 'User.UserPk',
          field: 'userPk',
          dataType: 'number',
          disabled: true,
          width: '300px'
        },
        {
          labelKey: 'User.FullName',
          field: 'fullName',
          dataType: 'string',
          disabled: true,
          width: '220px'
        }
      ],
      dataFactory: () => new User(),
      label: 'User.Users'
    }
  });

  dialogRef.afterClosed().pipe(take(1)).subscribe((pickedUser: User | null) => {
    if (pickedUser) {
      if(userSearchType === UserSearchType.Teacher)
      this.selectedTeacher = pickedUser;    
      else if(userSearchType === UserSearchType.Student)
      this.selectedStudent = pickedUser;
      else
      this.selectedUser = pickedUser;
      this.dir.markForCheck(); 
    }
  });
}

  
clearUser(userType : UserSearchType): void {
  if(userType === UserSearchType.Teacher)
  this.selectedTeacher = null;
  else if(userType === UserSearchType.Student)
  this.selectedStudent = null;
  else
  this.selectedUser = null;
}


openCourseSearchDialog(): void {
  const dialogRef = this.dialog.open(SearchDialogComponent, {
    maxWidth: '80vw',
    width: '60vw',
    data: {
      apiEndpoint: '/teacherCourses/search',
      label: 'Reports.Course', // ترجمته عندك
      // أعمدة الجدول داخل الدايالوج
      columns: [
        { labelKey: 'TeacherCourse.TeacherCoursePk', field: 'teacherCoursePk', dataType: 'number', disabled: true, width: '120px' },
        { labelKey: 'TeacherCourse.Name', field: 'teacherCourseName', dataType: 'string', width: '260px' },
        { labelKey: 'TeacherCourse.Subject', field: 'subjectName', dataType: 'string', width: '200px' },
        { labelKey: 'TeacherCourse.Teacher', field: 'teacherName', dataType: 'string', width: '200px' },
      ],
      dataFactory: (row: any) => new TeacherCourse(),
    },
  });

  dialogRef.afterClosed().pipe(take(1)).subscribe((picked: TeacherCourse | null) => {
    if (!picked) return;
    this.selectedCourse = picked;
    this.dir.markForCheck();
  });
}

clearCourse(): void {
  this.selectedCourse = null;
  this.dir.markForCheck();
}



}


