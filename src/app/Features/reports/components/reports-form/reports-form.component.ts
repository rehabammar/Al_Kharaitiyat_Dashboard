import { Component } from '@angular/core';
import { ReportsService } from '../../services/reports.service';
import { ReportsType } from '../../services/reports-type';
import { ApiEndpoints } from '../../../../core/constants/api-endpoints';
import { UserService } from '../../../auth/services/user.service';
import { User } from '../../../auth/models/user.model';

@Component({
  selector: 'app-reports-form',
  standalone: false,
  templateUrl: './reports-form.component.html',
  styleUrl: './reports-form.component.css'
})
export class ReportsFormComponent {

  startDate: string ="";
  endDate: string ="";

  reportType: ReportsType = ReportsType.payments;
  downloading = false;


  constructor(private reports: ReportsService , private userService : UserService) {}

  teacherDataFactory = () => new User();
  

 dateOnly(s?: string | null): string {
  if (!s) return '';
  return s.includes('T') ? s.slice(0, 10) : s;
}

  async onDownloadReports() {
  const start = this.dateOnly(this.startDate);
  const end   = this.dateOnly(this.endDate);
  this.downloading = true;
  this.reports.downloadReport({
    type: this.reportType as any,
    startDate: start,
    endDate: end,
    openAfterDownload: true,
  }).finally(() => this.downloading = false);

    // this.snack.open(
    //   ok ? 'تم تنزيل التقرير بنجاح' : 'فشل تنزيل التقرير',
    //   'إغلاق',
    //   { duration: 3000, panelClass: ok ? ['snack-success'] : ['snack-error'] }
    // );
  }

  onComboSelected(item : User | null){}

}


