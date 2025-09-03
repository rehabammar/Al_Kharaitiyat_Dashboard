import { Component } from '@angular/core';
import { ReportsService } from '../../services/reports.service';
import { ReportsType } from '../../services/reports-type';
import { ApiEndpoints } from '../../../../core/constants/api-endpoints';
import { UserService } from '../../../auth/services/user.service';
import { User } from '../../../auth/models/user.model';
import { TeacherCourse } from '../../../courses/models/teacher-course.model';

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
  sselectedStudent : User | null = null ;

  selectedCourse : TeacherCourse | null = null ;

  reportType!: ReportsType ;
  downloading = false;



  constructor(private reports: ReportsService , private userService : UserService) {}

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
      studentId: this.sselectedStudent?.userPk,
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
    this.sselectedStudent = item ;
  }

  onCourseSelected(item : TeacherCourse | null){
    this.selectedCourse = item ;
  }


}


