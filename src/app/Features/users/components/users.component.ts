import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../auth/models/user.model';
import { TableColumn } from '../../../core/models/table-column.interface';
import { LookupDetail } from '../../../core/models/lookup-detail.model';
import { AppComponent } from '../../../app.component';
import { AppConstants } from '../../../core/constants/app_constants';
import { GenericTableComponent } from '../../../shared/components/table-components/generic-table/generic-table.component';

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent  {

  constructor(private cdr: ChangeDetectorRef) {}

  @ViewChild('usersTable') usersTable!: GenericTableComponent<User>;

  userDataFactory = () => new User();

  lookupDetailDataFactory = () => ({ lookupDetailPk: null, lookupName: null });
  stageDataFactory = () => ({ stagePk: null, stageName: null });
  levelDataFactory = () => ({ levelPk: null, levelName: null });

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
    // Status flag
    // {
    //   labelKey: 'User.Status',
    //   field: 'statusFl',
    //   required: false,
    //   isFlag: true,
    //   width: '120px'
    // },
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

  onUserSaved(row: User) {
    this.usersTable.patchRowById(row.userPk, row);
  }

  onNewUserRow(row: User) {
    this.selectedUser = row;
    this.usersTable.prependRow(row);
  }

  onUserRowDeleted(e: { type: 'new' | 'persisted'; id?: any; row?: any }) {
    if (e.type === 'new') {
      this.usersTable.removeRow(e.row);
    } else {
      this.usersTable.removeRow(e.id);
    }
    this.selectedUser = null;
  }



updateFormColumn() {
  this.formCloumns = [] ;
  let extra: TableColumn[] = [];

  if (this.selectedUser?.userTypeFk === AppConstants.TEACHER) {
    extra = this.teacherColumns;
  } else if (this.selectedUser?.userTypeFk === AppConstants.STUDENT) {
    extra = this.studentColumns;
  }

  this.formCloumns = [...this.userColumns, ...extra];
}


}
