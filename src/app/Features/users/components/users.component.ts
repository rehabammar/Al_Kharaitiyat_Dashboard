import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../auth/models/user.model';
import { TableColumn } from '../../../core/models/table-column.interface';
import { AppConstants } from '../../../core/constants/app_constants';
import { GenericTableComponent } from '../../../shared/components/table-components/generic-table/generic-table.component';
import { TeacherQualification } from '../model/teacher-qualification.model';
import { TeacherSubject } from '../model/teacher-subject.model';
import { Lookup } from '../../system-lookups/model/lookup.model';
import { Stage } from '../../courses/models/stage.model';
import { LookupDetail } from '../../../core/models/lookup-detail.model';

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {

  constructor(private cdr: ChangeDetectorRef) { }

  @ViewChild('usersTable') usersTable!: GenericTableComponent<User>;

  userDataFactory = () => new User();

  lookupDetailDataFactory = () => ({ lookupDetailPk: null, lookupName: null });
  stageDataFactory = () => ({ stagePk: null, stageName: null });
  levelDataFactory = () => ({ levelPk: null, levelName: null });

  teacherQualificationDataFactory = ()=> new TeacherQualification();
  teacherSubjectDataFactory = ()=> new TeacherSubject();


  formCloumns: TableColumn[] = [];

  userColumns: TableColumn[] = [
    {
      labelKey: 'User.UserPk',
      field: 'userPk',
      required: false,
      dataType: 'number',
      disabled: true,
      width: '300px'
    },
    {
      labelKey: 'User.FirstName',
      field: 'firstName',
      required: true,
      dataType: 'string',
      width: '160px'
    },
    {
      labelKey: 'User.SecondName',
      field: 'secondName',
      required: false,
      dataType: 'string',
      width: '160px'
    },
    {
      labelKey: 'User.ThirdName',
      field: 'thirdName',
      required: false,
      dataType: 'string',
      width: '160px'
    },
    {
      labelKey: 'User.LastName',
      field: 'lastName',
      required: true,
      dataType: 'string',
      width: '160px'
    },
    // {
    //   labelKey: 'User.FullName',
    //   field: 'fullName',
    //   required: false,
    //   dataType: 'string',
    //   disabled: true,
    //   width: '220px'
    // },

    // Username / Email / Phones
    {
      labelKey: 'User.Username',
      field: 'username',
      required: true,
      dataType: 'string',
      width: '160px'
    },
    {
      labelKey: 'User.Password',
      field: 'password',
      required: true,
      dataType: 'password',
      width: '160px',
      showInTable: false,
    },
    {
      labelKey: 'User.Email',
      field: 'email',
      required: true,
      dataType: 'string',
      width: '220px'
    },
    {
      labelKey: 'User.Phone',
      field: 'phoneNumber',
      required: true,
      dataType: 'mobile',
      width: '170px'
    },
    {
      labelKey: 'User.DateOfBirth',
      field: 'dateOfBirth',
      required: false,
      dataType: 'date',
      width: '180px'
    },

    // {
    //   labelKey: 'User.WhatsApp',
    //   field: 'whatsappNumber',
    //   required: false,
    //   dataType: 'string',
    //   width: '170px'
    // },

    // Comboboxes: Gender / Nationality / UserType
    {
      labelKey: 'User.Gender',
      field: 'genderName',
      fieldFK: 'genderFk',
      isCombobox: true,
      required: true,
      apiPath: '/lookupDetails/gender',
      displayItemKey: 'lookupName',
      primaryKey: 'lookupDetailPk',
      dataFactory: this.lookupDetailDataFactory,
      width: '140px'
    },
    {
      labelKey: 'User.UserType',
      field: 'userTypeName',
      fieldFK: 'userTypeFk',
      isCombobox: true,
      required: true,
      apiPath: '/lookupDetails/userType',
      displayItemKey: 'lookupName',
      primaryKey: 'lookupDetailPk',
      dataFactory: this.lookupDetailDataFactory,
      width: '160px'
    },
    {
      labelKey: 'User.Status',
      field: 'isActiveFl',
      required: false,
      isFlag: true,
      width: '120px'
    },
    // Guardian (اختياري)
    // {
    //   labelKey: 'User.GuardianName',
    //   field: 'guardianName',
    //   required: false,
    //   dataType: 'string',
    //   width: '200px'
    // },
    // {
    //   labelKey: 'User.GuardianPhone',
    //   field: 'guardianPhone',
    //   required: false,
    //   dataType: 'string',
    //   width: '200px'
    // },
    // {
    //   labelKey: 'User.GuardianEmail',
    //   field: 'guardianEmail',
    //   required: false,
    //   dataType: 'string',
    //   width: '220px'
    // },
    // {
    //   labelKey: 'User.Notes',
    //   field: 'notes',
    //   required: false,
    //   dataType: 'string',
    //   width: '240px'
    // },

  ];


  studentColumns: TableColumn[] = [
    {
      labelKey: 'User.Stage',
      field: 'stageFkDesc',
      fieldFK: 'stageFk',
      isCombobox: true,
      required: true,
      apiPath: '/stages/searchAll',
      displayItemKey: 'stageName',
      primaryKey: 'stagePk',
      dataFactory: this.stageDataFactory,
      width: '180px',
      showInTable: false,
    },
    {
      labelKey: 'User.Level',
      field: 'levelFkDesc',
      fieldFK: 'levelFk',
      isCombobox: true,
      required: true,
      apiPath: '/levels/searchAll',
      displayItemKey: 'levelName',
      primaryKey: 'levelPk',
      dataFactory: this.levelDataFactory,
      width: '180px',
      showInTable: false,
      paramsMap: { stageFk: 'stageFk' },
      dependsOn: ['stageFk'],

    },
  ];

  teacherColumns: TableColumn[] = [
    // Job info
    {
      labelKey: 'User.JobTitle',
      field: 'jobTitle',
      required: true,
      dataType: 'string',
      width: '200px',
      showInTable: false
    },
    {
      labelKey: 'User.Specialization',
      field: 'specialization',
      required: true,
      dataType: 'string',
      width: '200px',
      showInTable: false

    },
    {
      labelKey: 'User.ExperienceYears',
      field: 'experienceYears',
      required: false,
      dataType: 'number',
      width: '140px'
    },
    {
      labelKey: 'User.EducationLevel',
      field: 'educationLevel',
      required: false,
      dataType: 'string',
      width: '220px'
    },
    {
      labelKey: 'User.TeacherScore',
      field: 'teacherScore',
      required: false,
      dataType: 'evaluation',
      width: '220px'
    },
  ];


  teacherQualificationsColumns: TableColumn[] = [
    {
      field: 'title',
      labelKey: 'TeacherQualification.Title',
      width: '200px'
    },
     {
      field: 'qualificationTypeFkName',
      labelKey: 'TeacherQualification.Type',
      width: '140px'
    },
    {
      field: 'major',
      labelKey: 'TeacherQualification.Major',
      width: '140px'
    },
    {
      field: 'institutionName',
      labelKey: 'TeacherQualification.Institution',
      width: '160px'
    },
    {
      field: 'issueDate',
      labelKey: 'TeacherQualification.IssueDate',
      dataType: 'date',
      width: '140px'
    },
    {
      field: 'certificateFileUrl',
      labelKey: 'TeacherQualification.CertificateUrl',
      dataType: 'file',
      width: '220px'
    }
  ];


   teacherSubjectColumns:  TableColumn[] = [
  {
    labelKey: 'TeacherSubjects.subject',
    field: 'subjectName',
    fieldFK: 'subjectFk',
    required: true,
    isCombobox: true,
    apiPath: '/lookupDetails/subjects',
    displayItemKey: 'lookupName',
    primaryKey: 'lookupDetailPk',
    dataFactory: () => new LookupDetail(),
    width: '200px',
  },
  {
    labelKey: 'TeacherSubjects.stage',
    field: 'stageName',
    fieldFK: 'stageFk',
    isCombobox: true,
    apiPath: '/stages/searchAll',
    displayItemKey: 'stageName',
    primaryKey: 'stagePk',
    dataFactory: () => new Stage,
    width: '200px',
  },
  {
    labelKey: 'TeacherSubjects.experienceYears',
    field: 'experienceYears',
    dataType: 'number',
    width: '120px',
  },
  // {
  //   labelKey: 'TeacherSubjects.notes',
  //   field: 'notes',
  //   dataType: 'string',
  //   width: '250px',
  // },
];


  selectedUser: User | null = null;


  onUserSelected = (row: User) => {
    this.selectedUser = row;
    this.updateFormColumn();

  };


  onselectedUserRowChanged(e: { field: string; value: any }) {
    if (!this.selectedUser) return;
    this.selectedUser = {
      ...this.selectedUser,
      [e.field]: e.value
    };
    if (e.field === 'userTypeFk') {
      this.updateFormColumn();
      this.cdr.detectChanges();
    }
    const id = this.selectedUser.userPk;
    this.usersTable.patchRowById(id, { [e.field]: e.value } as Partial<User>);
  }

  private currentUserDraftCid: string | null = null;
  onNewUserRow(row: any) {
    this.currentUserDraftCid = row.__cid;
    this.selectedUser = row;
    this.usersTable.prependRow(row);
  }
  onUserSaved(row: User) {
    this.usersTable.patchRowById(row.userPk, row);

    if (this.currentUserDraftCid) {
      this.usersTable.replaceRowByCid(this.currentUserDraftCid, row);
      this.currentUserDraftCid = null;
    } else {
      this.usersTable.upsertByPk('userPk', row);
    }
    this.usersTable.selectRowById(row.userPk);
  }

  onUserRowDeleted(e: { type: 'new' | 'persisted'; id?: any; row?: any }) {
    if (e.type === 'new') {
      this.usersTable.removeRow(e.row);
    } else {
      this.usersTable.removeRow(e.id);
    }
  }



  updateFormColumn() {
    this.formCloumns = [];
    let extra: TableColumn[] = [];

    if (this.selectedUser?.userTypeFk === AppConstants.TEACHER) {
      extra = this.teacherColumns;
    } else if (this.selectedUser?.userTypeFk === AppConstants.STUDENT) {
      extra = this.studentColumns;
    }

    this.formCloumns = [...this.userColumns, ...extra];
  }


}
