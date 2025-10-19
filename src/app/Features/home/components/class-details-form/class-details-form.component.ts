import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { map, Observable, of, take } from 'rxjs';
import { Class } from '../../../courses/models/class.model';
import { TableColumn } from '../../../../core/models/table-column.interface';
import { ApiService } from '../../../../core/services/api/api-service.service';
import { HomeService } from '../../services/home.servics';
import { ButtonVisibilityConfig } from '../../../../core/models/button-visibility-config.interface';
import { StudentAttendance } from '../../../courses/models/student-attendance.model';
import { ApiEndpoints } from '../../../../core/constants/api-endpoints';
import { SearchDialogComponent } from '../../../../shared/components/search-dialog/search-dialog.component';
import { User } from '../../../auth/models/user.model';

type DialogData = { classId: number };

@Component({
  selector: 'app-class-details-form',
  standalone: false,
  templateUrl: './class-details-form.component.html',
  styleUrls: ['./class-details-form.component.css']
})
export class ClassDetailsFormComponent implements OnInit {

  loading = true;
  error?: string;

  selectedClass: Class | null = null;

  StudentAttendanceDataFactory = () => new StudentAttendance();

  private baseClassFormColumns: TableColumn[] = [];


  classFormCloumns: TableColumn[] = [
    {
      labelKey: 'Class.ClassPk',
      field: 'classPk',
      required: false,
      dataType: 'number',
      disabled: true,
      width: '200px'
    },
    {
      labelKey: 'Class.Title',
      field: 'classTitle',
      required: false,
      dataType: 'string',
      disabled: false,
      width: '220px'
    },
    {
      labelKey: 'Class.Location',
      field: 'locationName',
      fieldFK: 'locationFk',
      required: true,
      isCombobox: true,
      apiPath: '/lookupDetails/courseLocation',
      displayItemKey: 'lookupName',
      primaryKey: 'lookupDetailPk',
      dataFactory: (q?: any) => this.lookupDetailDataFactory('/lookupDetails/courseLocation', q),
      width: '180px'
    },
    {
      labelKey: 'Class.Status',
      field: 'statusName',
      fieldFK: 'classStatusFk',
      required: true,
      isCombobox: true,
      apiPath: '/lookupDetails/class-status',
      displayItemKey: 'lookupName',
      primaryKey: 'lookupDetailPk',
      dataFactory: (q?: any) => this.lookupDetailDataFactory('/lookupDetails/class-status', q),
      width: '160px'
    },
    {
      labelKey: 'Class.ExpectedStartTime',
      field: 'expectedStartTime',
      required: true,
      dataType: 'datetime',
      disabled: false,
      width: '200px'
    },
    {
      labelKey: 'Class.ExpectedEndTime',
      field: 'expectedEndTime',
      required: true,
      dataType: 'datetime',
      disabled: false,
      width: '200px'
    },
    {
      labelKey: 'Class.ActualStartTime',
      field: 'actualStartDate',
      required: false,
      dataType: 'datetime',
      disabled: true,
      width: '200px'
    },
    {
      labelKey: 'Class.ActualEndTime',
      field: 'actualEndDate',
      required: false,
      dataType: 'datetime',
      disabled: true,
      width: '200px'
    },
    {
      labelKey: 'Class.CenterCarFlag',
      field: 'centerCarFlag',
      required: false,
      isFlag: true,
      width: '180px',
      showInTable: false
    },
    {
      labelKey: 'Class.CenterCarCost',
      field: 'centerCarCost',
      required: false,
      dataType: 'number',
      disabled: false,
      width: '160px',
      showInTable: false,
    }
  ];

  cancelClassReasonColumns: TableColumn[] = [
    {
      labelKey: 'Class.CancelClassReason',
      field: 'cancelReason',
      required: true,
      dataType: 'string',
      disabled: false,
      showInTable: false,
    },
  ];

  studentAttendanceColumns: TableColumn[] = [
    {
      labelKey: 'StudentAttendance.StudentAttendanceClassPk',
      field: 'studentAttendanceClassPk',
      required: false,
      dataType: 'number',
      disabled: true,
      width: '140px'
    },
    {
      labelKey: 'StudentAttendance.StudentName',
      field: 'studentName',
      required: true,
      dataType: 'string',
      disabled: false,
      width: '220px',
      searchField: true,
      searchFieldplaceholder: 'CourseStudent.SelectStudent',
      onSearch: () => this.openStudentAttendencSearchDialog()
    },
    {
      labelKey: 'StudentAttendance.AttendanceDate',
      field: 'studentAttendanceDate',
      required: false,
      dataType: 'datetime',
      disabled: true,
      width: '220px',
    },
    // {
    //   labelKey: 'StudentAttendance.PaymentStatusName',
    //   field: 'paymentStatusName',
    //   fieldFK:'paymentStatusFk',
    //   required: false,
    //   dataType: 'string',
    //   disabled: true,
    //   // isCombobox: true,
    //   // apiPath: '/lookupDetails/payment-status',
    //   // displayItemKey: 'lookupName',
    //   // primaryKey: 'lookupDetailPk',
    //   // dataFactory: () => new LookupDetail(),
    //   width: '180px'
    // },
    {
      labelKey: 'StudentAttendance.ClassEvalution',
      field: 'teacherReview',
      required: false,
      dataType: 'evaluation',
      disabled: true,
      width: '180px'
    },
    {
      labelKey: 'StudentAttendance.Comment',
      field: 'teacherReviewComment',
      required: false,
      dataType: 'string',
      disabled: true,
      width: '180px'
    },


  ];


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<ClassDetailsFormComponent>,
    private homeService: HomeService,
    private api: ApiService,
    private dialog: MatDialog,              // 👈 inject MatDialog here

  ) { }


  bottomVisability: ButtonVisibilityConfig = {
    showDelete: true,
    showSave: true,
  };

  ngOnInit(): void {
    this.homeService.getClassById(this.data.classId).subscribe({
      next: (cls) => {
        this.selectedClass = cls;
        this.loading = false;
        this.classFormCloumns = this.buildClassFormColumns();
      },
      error: (err) => {
        this.error = (err?.message || 'Failed to load class');
        this.loading = false;
      }
    });
  }

  // اختياري: مصدر بيانات للكومبو بوكس (لو Generic Form محتاج observable)
  lookupDetailDataFactory(path: string, _q?: any): Observable<any[]> {
    // لو عندك ApiService.get(...) جاهزة
    return this.api.get<any>(path) as unknown as Observable<any[]>;
  }

  // إغلاق البوب-أب بعد الحفظ (لو حابب)
  onRowSaved(_: any) {
    this.dialogRef.close(true);
  }

  onRowDeleted(_: any) {
    this.dialogRef.close(true);
  }

  onClose() {
    this.dialogRef.close();
  }

  onClassRowChanged(e: { field: string; value: any }) {
    if (!this.selectedClass) return;
    this.selectedClass = { ...this.selectedClass, [e.field]: e.value };
    if (e.field === 'classStatusFk') {

      Promise.resolve().then(() => {
        this.classFormCloumns = this.buildClassFormColumns();
      });
    }

  }


  openStudentAttendencSearchDialog(): Observable<StudentAttendance | null> {

    const dialogRef = this.dialog.open(SearchDialogComponent,
      {
        maxWidth: "80vw",
        width: '50vw',
        data: {
          apiEndpoint: ApiEndpoints.findStudentsNotInClass,
          columns: [
            {
              labelKey: 'User.UserPk',
              field: 'userPk',
              required: false,
              dataType: 'number',
              disabled: true,
              width: '300px'
            },
            {
              labelKey: 'User.FullName',
              field: 'fullName',
              required: false,
              dataType: 'string',
              disabled: true,
              width: '220px'
            },
          ],
          dataFactory: () => new User(),
          parameter: {
            teacherCourseFk: this.selectedClass?.teacherCourseFk,
            classFk: this.selectedClass?.classPk
          },
          label: 'CourseStudent.Students'
        }
      }

    );
    return dialogRef.afterClosed().pipe(
      take(1),
      map((pickedUser: User | null) => {
        if (!pickedUser) return null;
        return new StudentAttendance({
          studentFk: pickedUser.userPk,
          studentName: pickedUser.fullName,
        });
      })
    );
  }

  // private refreshCancelReasonColumns(): void {
  //   const status = this.selectedClass?.classStatusFk;
  //   const needCancelReason = status === 67; // 67 = Canceled
  //   this.classFormCloumns = needCancelReason
  //     ? [...this.classFormCloumns.filter(c => c.field !== 'cancelReason'), ...this.cancelClassReasonColumns]
  //     : this.classFormCloumns.filter(c => c.field !== 'cancelReason');
  // }



  // ========================================
  private readonly CLASS_STATUS = {
    STARTED: 65,
    ENDED: 66,
    CANCELED: 67,
  };

  private buildClassFormColumns(): TableColumn[] {
    // ✳️ اشطب أي تكرارات سابقة لعمود سبب الإلغاء
    const cols = this.classFormCloumns
      .filter(c => c.field !== 'cancelReason')
      .map(c => ({ ...c })); // نسخ عميق بسيط للتريجرينج

    const status = this.selectedClass?.classStatusFk;

    // ابحث عن حقول الوقت الفعلي
    const startIdx = cols.findIndex(c => c.field === 'actualStartDate');
    const endIdx = cols.findIndex(c => c.field === 'actualEndDate');

    // أعد القيم الافتراضية
    if (startIdx !== -1) {
      cols[startIdx].disabled = true;
      cols[startIdx].required = false;
    }
    if (endIdx !== -1) {
      cols[endIdx].disabled = true;
      cols[endIdx].required = false;
    }

    // فعّل/ألزم حسب الحالة
    if ((status === this.CLASS_STATUS.STARTED || status === this.CLASS_STATUS.ENDED) && startIdx !== -1) {
      cols[startIdx].disabled = false;
      cols[startIdx].required = true;
    }
    if (status === this.CLASS_STATUS.ENDED && endIdx !== -1) {
      cols[endIdx].disabled = false;
      cols[endIdx].required = true;
    }

    // ✳️ أضِف عمود سبب الإلغاء مرة واحدة فقط عند الإلغاء
    if (status === this.CLASS_STATUS.CANCELED) {
      return [...cols, ...this.cancelClassReasonColumns];
    }

    return cols;
  }


}
