import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TeacherCourse } from '../models/teacher-course.model';
import { TableColumn } from '../../../core/models/table-column.interface';
import { Level } from '../models/level.model';
import { LookupDetail } from '../../../core/models/lookup-detail.model';
import { Stage } from '../models/stage.model';
import { AcademicYear } from '../models/academic-year.model';
import { AcademicTerm } from '../models/academic-term.model';
import { User } from '../../auth/models/user.model';
import { Class } from '../models/class.model';
import { GenericTableComponent } from '../../../shared/components/table-components/generic-table/generic-table.component';
import { CourseStudent } from '../models/course-student.model';
import { StudentAttendance } from '../models/student-attendance.model';

interface Course {
  category: string;
  title: string;
  img: string;
  rating: number;
  reviews: number;
  price: number;
  link: string;
}
interface Topic {
  title: string;
  img: string;
  link: string;
}
interface ServiceItem {
  icon: string;
  title: string;
  desc: string;
}

@Component({
  selector: 'app-courses-page',
  standalone: false,
  templateUrl: './courses-page.component.html',
  styleUrl: './courses-page.component.css'
})
export class CoursesPageComponent {

  @ViewChild('teacherCourseTable') table!: GenericTableComponent<TeacherCourse>;
  @ViewChild('classesTableRef') classesTable!: GenericTableComponent<Class>;



  // teacher course
  teacherCourseDataFactory = () => new TeacherCourse();
  teacherDataFactory = () => new User();
  levelDataFactory = () => new Level();
  lookupDetailDataFactory = () => new LookupDetail();
  stageDataFactory = () => new Stage();
  academicYearDataFactory = () => new AcademicYear();
  academicTermDataFactory = () => new AcademicTerm();

  // course class

  classDataFactory = () => new Class();
  StudentAttendanceDataFactory = () => new StudentAttendance();


  // course class 

  courseStudentDataFactory = () => new CourseStudent();



  teacherCourseColumns: TableColumn[] = [
    {
      labelKey: 'TeacherCourse.TeacherCoursePk',
      field: 'teacherCoursePk',
      required: false,
      dataType: 'number',
      disabled: true,
      width: '100px'
    },
    {
      labelKey: 'TeacherCourse.Name',
      field: 'teacherCourseName',
      required: true,
      dataType: 'string',
      disabled: false,
      width: '220px'
    },
    {
      labelKey: 'TeacherCourse.AcademicYear',
      field: 'academicYearName',
      fieldFK: 'academicYearFk',
      required: true,
      isCombobox: true,
      apiPath: "/academicYears/search",
      displayItemKey: "yearName",
      primaryKey: "academicYearPk",
      dataFactory: this.academicYearDataFactory,
      width: '180px'
    },
    {
      labelKey: 'TeacherCourse.AcademicTerm',
      field: 'academicTermName',
      fieldFK: 'academicTermFk',
      required: true,
      isCombobox: true,
      apiPath: "/academicTerms/search",
      displayItemKey: "termName",
      primaryKey: "academicTermPk",
      dataFactory: this.academicTermDataFactory,
      width: '160px'
    },
    {
      labelKey: 'TeacherCourse.Teacher',
      field: 'teacherName',
      fieldFK: 'coursesTeacherFk',
      required: true,
      isCombobox: true,
      apiPath: "/users/search-teachers",
      displayItemKey: "fullName",
      primaryKey: "userPk",
      dataFactory: this.teacherDataFactory,
      width: '220px'
    },
    {
      labelKey: 'TeacherCourse.Subject',
      field: 'subjectName',
      fieldFK: 'coursesSubjectFk',
      required: true,
      isCombobox: true,
      apiPath: "/lookupDetails/subjects",
      displayItemKey: "lookupName",
      primaryKey: "lookupDetailPk",
      dataFactory: this.lookupDetailDataFactory,
      width: '180px'
    },
    {
      labelKey: 'TeacherCourse.Stage',
      field: 'stageName',
      fieldFK: 'stageFk',
      required: true,
      isCombobox: true,
      apiPath: "/stages/searchAll",
      displayItemKey: "stageName",
      primaryKey: "stagePk",
      dataFactory: this.stageDataFactory,
      width: '180px'
    },
    {
      labelKey: 'TeacherCourse.Level',
      field: 'levelName',
      fieldFK: 'levelFk',
      required: true,
      isCombobox: true,
      apiPath: "/levels/searchAll",
      displayItemKey: "levelName",
      primaryKey: "levelPk",
      dataFactory: this.levelDataFactory,
      width: '220px'
    },

    {
      labelKey: 'TeacherCourse.courseLocation',
      field: 'courseTypeName',
      fieldFK: 'courseTypeFk',
      required: true,
      isCombobox: true,
      apiPath: "/lookupDetails/courseLocation",
      displayItemKey: "lookupName",
      primaryKey: "lookupDetailPk",
      dataFactory: this.lookupDetailDataFactory,
      width: '140px',
      showInTable: false
    },
    {
      labelKey: 'TeacherCourse.Status',
      field: 'courseStatusName',
      fieldFK: 'courseStatusFk',
      required: true,
      isCombobox: true,
      apiPath: "/lookupDetails/course-status",
      displayItemKey: "lookupName",
      primaryKey: "lookupDetailPk",
      dataFactory: this.lookupDetailDataFactory,
      width: '120px'
    },
    {
      labelKey: 'TeacherCourse.Price',
      field: 'coursePrice',
      required: true,
      dataType: 'number',
      disabled: false,
      width: '110px'
    },
    // {
    //   labelKey: 'TeacherCourse.PriceType',
    //   field: 'priceTypeFkName',
    //   fieldFK: 'priceTypeFk',
    //   required: true,
    //   isCombobox: true,
    //   apiPath: "/lookupDetails/price-type",
    //   displayItemKey: "lookupName",
    //   primaryKey: "lookupDetailPk",
    //   dataFactory: this.lookupDetailDataFactory,
    //   width: '130px'
    // },
    // {
    //   labelKey: 'TeacherCourse.CenterPercentage',
    //   field: 'centerPercentage',
    //   required: true,
    //   dataType: 'number',
    //   disabled: false,
    //   width: '130px'
    // },
    // {
    //   labelKey: 'TeacherCourse.MaxStudents',
    //   field: 'maxStudents',
    //   required: true,
    //   dataType: 'number',
    //   disabled: false,
    //   width: '120px'
    // },
    {
      labelKey: 'TeacherCourse.ActualStudentsCount',
      field: 'actualStudentsCount',
      required: true,
      dataType: 'number',
      disabled: false,
      width: '230px'
    },
    // {
    //   labelKey: 'TeacherCourse.DurationMinutes',
    //   field: 'durationMinutes',
    //   required: false,
    //   dataType: 'number',
    //   disabled: false,
    //   width: '140px'
    // },
    // {
    //   labelKey: 'TeacherCourse.Organization',
    //   field: 'organizationName',
    //   required: false,
    //   dataType: 'string',
    //   disabled: true,
    //   width: '200px'
    // },
    // {
    //   labelKey: 'TeacherCourse.CreationDate',
    //   field: 'creationDate',
    //   required: false,
    //   dataType: 'date',
    //   disabled: true,
    //   width: '170px'
    // },
    // {
    //   labelKey: 'TeacherCourse.ModifiedDate',
    //   field: 'modifiedDate',
    //   required: false,
    //   dataType: 'date',
    //   disabled: true,
    //   width: '170px'
    // },
    // {
    //   labelKey: 'TeacherCourse.Notes',
    //   field: 'notes',
    //   required: false,
    //   dataType: 'string',
    //   disabled: false,
    //   width: '500px'
    // }
  ];

  classColumns: TableColumn[] = [
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
      required: true,
      dataType: 'string',
      disabled: false,
      width: '220px'
    },

    // الكورس/الشعبة (Combobox من teacherCourses)
    // {
    //   labelKey: 'Class.TeacherCourse',
    //   field: 'teacherCourseName',
    //   fieldFK: 'teacherCourseFk',
    //   required: true,
    //   isCombobox: true,
    //   apiPath: '/teacherCourses/search',          // ← عدّل لو مختلف
    //   displayItemKey: 'teacherCourseName',
    //   primaryKey: 'teacherCoursePk',
    //   dataFactory: this.teacherCourseDataFactory, // ← وفّرها
    //   width: '220px'
    // },

    // المكان (Combobox من lookupDetails)
    // {
    //   labelKey: 'Class.Location',
    //   field: 'locationName',
    //   fieldFK: 'locationFk',
    //   required: true,
    //   isCombobox: true,
    //   apiPath: '/lookupDetails/class-location',   // أو '/locations/searchAll'
    //   displayItemKey: 'lookupName',               // لو lookupDetails
    //   primaryKey: 'lookupDetailPk',
    //   dataFactory: this.lookupDetailDataFactory,
    //   width: '180px'
    // },
    {
      labelKey: 'Class.Status',
      field: 'statusName',
      fieldFK: 'classStatusFk',
      required: true,
      isCombobox: true,
      apiPath: '/lookupDetails/class-status',
      displayItemKey: 'lookupName',
      primaryKey: 'lookupDetailPk',
      dataFactory: this.lookupDetailDataFactory,
      width: '160px'
    },
    // {
    //   labelKey: 'Class.PriceType',
    //   field: 'classPriceTypeFkName',
    //   fieldFK: 'classPriceTypeFk',
    //   required: false,
    //   isCombobox: true,
    //   apiPath: '/lookupDetails/price-type',
    //   displayItemKey: 'lookupName',
    //   primaryKey: 'lookupDetailPk',
    //   dataFactory: this.lookupDetailDataFactory,
    //   width: '150px'
    // },
    {
      labelKey: 'Class.ExpectedStartTime',
      field: 'expectedStartTime',
      required: true,
      dataType: 'date',
      disabled: false,
      width: '200px'
    },
    {
      labelKey: 'Class.ExpectedEndTime',
      field: 'expectedEndTime',
      required: true,
      dataType: 'date',
      disabled: false,
      width: '200px'
    },

    // مبالغ/تكاليف
    // {
    //   labelKey: 'Class.PaidToCenter',
    //   field: 'paidToCenter',
    //   required: false,
    //   dataType: 'number',
    //   disabled: false,
    //   width: '140px'
    // },
    // {
    //   labelKey: 'Class.PaidToTeacher',
    //   field: 'paidToTeacher',
    //   required: false,
    //   dataType: 'number',
    //   disabled: false,
    //   width: '140px'
    // },
    {
      labelKey: 'Class.ActualAmountRequired',
      field: 'actualAmountRequired',
      required: false,
      dataType: 'number',
      disabled: false,
      width: '170px'
    },
    {
      labelKey: 'Class.ActualPayedAmount',
      field: 'actualPayedAmount',
      required: false,
      dataType: 'number',
      disabled: false,
      width: '170px'
    },
    // {
    //   labelKey: 'Class.CostForStudent',
    //   field: 'classCostForStudent',
    //   required: false,
    //   dataType: 'number',
    //   disabled: false,
    //   width: '160px'
    // },

    // فلاج استلام مبالغ
    // {
    //   labelKey: 'Class.TeacherReceivedMoney',
    //   field: 'teacherReceivedMoneyFl',
    //   required: false,
    //   isFlag: true,
    //   width: '250px'
    // },
    // {
    //   labelKey: 'Class.CenterReceivedMoney',
    //   field: 'centerReceivedMoneyFl',
    //   required: false,
    //   isFlag: true,
    //   width: '250px'
    // },

    // تذكيري قبل (بالدقائق مثلاً)
    // {
    //   labelKey: 'Class.RemindedMeBefore',
    //   field: 'remindedMeBefore',
    //   required: false,
    //   dataType: 'number',
    //   disabled: false,
    //   width: '160px'
    // },

    // حقول زمن فعلية (عرض فقط)
    {
      labelKey: 'Class.ActualStartTime',
      field: 'actualStartDate',
      required: false,
      dataType: 'date',
      disabled: true,
      width: '200px'
    },
    {
      labelKey: 'Class.ActualEndTime',
      field: 'actualEndDate',
      required: false,
      dataType: 'date',
      disabled: true,
      width: '200px'
    },

    // ملاحظات
    // {
    //   labelKey: 'Class.Notes',
    //   field: 'notes',
    //   required: false,
    //   dataType: 'string',
    //   disabled: false,
    //   width: '300px'
    // },

    // (اختياري) إحداثيات قراءة فقط
    // {
    //   labelKey: 'Class.LocationStartLat',
    //   field: 'locationStartLat',
    //   required: false,
    //   dataType: 'number',
    //   disabled: true,
    //   width: '160px'
    // },
    // {
    //   labelKey: 'Class.LocationStartLong',
    //   field: 'locationStartLong',
    //   required: false,
    //   dataType: 'number',
    //   disabled: true,
    //   width: '160px'
    // },
    // {
    //   labelKey: 'Class.LocationEndLat',
    //   field: 'locationEndLat',
    //   required: false,
    //   dataType: 'number',
    //   disabled: true,
    //   width: '160px'
    // },
    // {
    //   labelKey: 'Class.LocationEndLong',
    //   field: 'locationEndLong',
    //   required: false,
    //   dataType: 'number',
    //   disabled: true,
    //   width: '160px'
    // },

  ];

  courseStudentColumns: TableColumn[] = [
    {
      labelKey: 'CourseStudent.CourseStudentPk',
      field: 'courseStudentPk',
      required: false,
      dataType: 'number',
      disabled: true,
      width: '110px',
    },
    {
      labelKey: 'CourseStudent.Student',
      field: 'studentFullName',
      fieldFK: 'studentFk',
      required: true,
      isCombobox: true,
      apiPath: '/students/searchAll',
      displayItemKey: 'fullName',
      primaryKey: 'studentPk',
      dataFactory: () => ({} as any),
      width: '240px',
    },
    {
      labelKey: 'CourseStudent.JoinStatus',
      field: 'joinStatusFkDesc',
      fieldFK: 'joinStatusFk',
      required: false,
      isCombobox: true,
      apiPath: '/lookupDetails/join-status',
      displayItemKey: 'lookupName',
      primaryKey: 'lookupDetailPk',
      dataFactory: () => ({} as any),
      width: '180px',
    },
    {
      labelKey: 'CourseStudent.RegistrationDate',
      field: 'courseStudentRegistrationDate',
      required: false,
      dataType: 'date',
      disabled: false,
      width: '200px',
    },

    // الحضور (فلاج)
    {
      labelKey: 'CourseStudent.Attendance',
      field: 'attendanceStatusFl',
      required: false,
      isFlag: true,
      width: '140px',
    },

    // ملاحظات
    {
      labelKey: 'CourseStudent.Notes',
      field: 'notes',
      required: false,
      dataType: 'string',
      disabled: false,
      width: '240px',
    }
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
      width: '220px'
    },
    {
      labelKey: 'StudentAttendance.PaymentStatusName',
      field: 'paymentStatusName',
      required: false,
      dataType: 'string',
      disabled: true,
      width: '180px'
    },
    {
      labelKey: 'StudentAttendance.ClassEvalution',
      field: 'teacherReview',
      required: false,
      dataType: 'number',
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





  selectedCourse: TeacherCourse | null = null;
  onTeacherCourseSelected(row: TeacherCourse) {
    this.selectedCourse = row;
  }

  onTeacherCourseRowChanged(e: { field: string; value: any }) {
    if (!this.selectedCourse) return;
    this.selectedCourse = {
      ...this.selectedCourse,
      [e.field]: e.value
    };

    const id = this.selectedCourse.teacherCoursePk;
    this.table.patchRowById(id, { [e.field]: e.value } as Partial<TeacherCourse>);
  }

  onTeacherCourseSaved(row: TeacherCourse) {
    this.table.patchRowById(row.teacherCoursePk, row);
  }

  onNewTeacherCourseRow(row: TeacherCourse) {
    this.selectedCourse = row;
    this.table.prependRow(row);
  }

  onTeacherCourseRowDeleted(e: { type: 'new' | 'persisted'; id?: any; row?: any }) {
    if (e.type === 'new') {
      this.table.removeRow(e.row);
    } else {
      this.table.removeRow(e.id);
    }
    this.selectedCourse = null;
  }

  // ======= Classes bussinces ========= 
  selectedClass: Class | null = null;
  onClassSelected(row: Class) {
    this.selectedClass = row;
  }
  onselectedClassRowChanged(e: { field: string; value: any }) {
    if (!this.selectedClass) return;
    this.selectedClass = {
      ...this.selectedClass,
      [e.field]: e.value
    };
    const id = this.selectedClass.classPk;
    this.classesTable.patchRowById(id, { [e.field]: e.value } as Partial<Class>);
  }

  onClassSaved(row: Class) {
    this.classesTable.patchRowById(row.classPk, row);
  }

  onNewClassRow(row: Class) {
    this.selectedClass = row;
    this.classesTable.prependRow(row);
  }

  onClassRowDeleted(e: { type: 'new' | 'persisted'; id?: any; row?: any }) {
    if (e.type === 'new') {
      this.classesTable.removeRow(e.row);
    } else {
      this.classesTable.removeRow(e.id);
    }
    this.selectedClass = null;
  }





}
