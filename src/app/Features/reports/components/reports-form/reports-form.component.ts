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
  onTeacherSelected(item : User | null){
    this.selectedTeacher = item ;
  }

  onStudentSelected(item : User | null){
    this.selectedStudent = item ;
  }

  onCourseSelected(item : TeacherCourse | null){
    this.selectedCourse = item ;
  }


 openUsersSearchDialog(): void {
  const dialogRef = this.dialog.open(SearchDialogComponent, {
    maxWidth: '80vw',
    width: '50vw',
    data: {
      apiEndpoint: ApiEndpoints.getAllUsers,
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
      this.selectedUser = pickedUser;
      this.dir.markForCheck(); 
    }
  });
}

  
}


