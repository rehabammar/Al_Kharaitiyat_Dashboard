import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ReportsType } from './reports-type';
import { filenameFromHeaders, saveBlob } from '../../../core/util/file-utils';
import { LanguageService } from '../../../core/services/shared/language.service';
import { ApiEndpoints } from '../../../core/constants/api-endpoints';
import { UserService } from '../../auth/services/user.service';

@Injectable({ providedIn: 'root' })
export class ReportsService {
  constructor(private http: HttpClient, private userService : UserService) {}

  // Map your enum -> backend report names
  private reportNameFor(type: ReportsType): string {
    switch (type) {
      case ReportsType.attendance:     return 'Attendance';
      case ReportsType.payments:       return 'Payments';
      case ReportsType.teacherCourses: return 'TeacherCoursesReport';
    }
  }  

  /** Download a report; interceptor will add Authorization/userId/lang headers */
  async downloadReport(opts: {
    type: ReportsType;
    startDate?: string | null;
    endDate?: string | null;
    openAfterDownload?: boolean;
    teacherId? : number ;
    studentId? : number ;
    courseId? : number ;
  }): Promise<boolean> {
    const {
      type,
      startDate,
      endDate,
      openAfterDownload = true,
      teacherId,
      studentId,
      courseId
    } = opts;

    const reportName = this.reportNameFor(type);

    // const isTeacher = currentUser.role === 'teacher';
    // const isStudent = currentUser.role === 'student';
    console.log("REPORTS Name " + reportName);

    const body = {
      reportName: reportName,
      parameters: {
        P_lang: LanguageService.getLanguage()?.langCode,
        P_user_id:    this.userService.getUser().userPk,
        P_user_name:  this.userService.getUser().username,
        P_start_date: startDate ,
        P_end_date:   endDate ,
        P_teacher_fk: teacherId,
        P_student_fk: studentId,
        filterType: 'teacher' ,
        P_teacher_course_fk: courseId,
        P_courses_teacher_fk:teacherId
      },
    };

  //   ----TeacherCoursesReport
	// 		--P_user_name
	// 		--P_lang
			
	// 		--P_teacher_fk

	// ----Payments
	// 		--P_lang
	// 		--P_user_name
			
	// 		--P_user_id
	// 		--P_start_date

	// 		--P_end_date
	// ----Attendance 
	// 		--P_lang
	// 		--P_user_name
			
	// 		--P_teacher_course_fk
	// 		--P_student_fk
	// 		--P_courses_teacher_fk
	// 		--P_user_name
	// 		--P_start_date
	// 		--P_end_date

    console.log("REPORTS PARAMTER " + JSON.stringify(body));

    try {
      const resp = await firstValueFrom(this.http.post(ApiEndpoints.generateAppReports(), body, {
        observe: 'response',
        responseType: 'blob',    
        headers: { Accept: 'application/pdf' }
      })) as HttpResponse<Blob>;

      // Handle error payloads sent as JSON but with 200 (some backends do this)
      if (resp.body && resp.body.type?.includes('application/json')) {
        const text = await resp.body.text();
        console.error('Report API returned JSON instead of PDF:', text);
        return false;
      }

      const blob = resp.body!;
      const contentFilename = filenameFromHeaders(resp.headers as any);
      const fallback = `${reportName}_${Date.now()}.pdf`;
      const filename = contentFilename || fallback;

      saveBlob(blob, filename, openAfterDownload);
      return true;
    } catch (e) {
      const err = e as HttpErrorResponse;
      // If server returned an error Blob, try reading it for logs
      if (err.error instanceof Blob) {
        try {
          const text = await err.error.text();
          console.error('Report error blob:', text);
        } catch {}
      } else {
        console.error('Report error:', err.message);
      }
      return false;
    }
  }
}
