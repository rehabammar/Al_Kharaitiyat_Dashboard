import { Component } from '@angular/core';
import { User } from '../../auth/models/user.model';
import { TableColumn } from '../../../core/models/table-column.interface';
import { LookupDetail } from '../../../core/models/lookup-detail.model';

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
userDataFactory = () => new User();

lookupDetailDataFactory = () => ({ lookupDetailPk: null, lookupName: null });
stageDataFactory = () => ({ stagePk: null, stageName: null });
levelDataFactory = () => ({ levelPk: null, levelName: null });


userColumns: TableColumn[] = [
  {
    labelKey: 'User.UserPk',
    field: 'userPk',
    required: false,
    dataType: 'number',
    disabled: true,
    width: '200px'
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
    labelKey: 'User.Email',
    field: 'email',
    required: false,
    dataType: 'string',
    width: '220px'
  },
  {
    labelKey: 'User.Phone',
    field: 'phoneNumber',
    required: true,
    dataType: 'string',
    width: '170px'
  },
  // {
  //   labelKey: 'User.WhatsApp',
  //   field: 'whatsappNumber',
  //   required: false,
  //   dataType: 'string',
  //   width: '170px'
  // },

  // Comboboxes: Gender / Nationality / UserType
  // {
  //   labelKey: 'User.Gender',
  //   field: 'genderName',
  //   fieldFK: 'genderFk',
  //   isCombobox: true,
  //   required: true,
  //   apiPath: '/lookupDetails/gender',         // عدّلي لو مختلف
  //   displayItemKey: 'lookupName',
  //   primaryKey: 'lookupDetailPk',
  //   dataFactory: this.lookupDetailDataFactory,
  //   width: '140px'
  // },
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
    labelKey: 'User.Stage',
    field: 'stageFkDesc',
    fieldFK: 'stageFk',
    isCombobox: true,
    required: false,
    apiPath: '/stages/searchAll',
    displayItemKey: 'stageName',
    primaryKey: 'stagePk',
    dataFactory: this.stageDataFactory,
    width: '180px'
  },
  {
    labelKey: 'User.Level',
    field: 'levelFkDesc',
    fieldFK: 'levelFk',
    isCombobox: true,
    required: false,
    apiPath: '/levels/searchAll',
    displayItemKey: 'levelName',
    primaryKey: 'levelPk',
    dataFactory: this.levelDataFactory,
    width: '180px'
  },

  // Date of birth
  // {
  //   labelKey: 'User.DateOfBirth',
  //   field: 'dateOfBirth',
  //   required: false,
  //   dataType: 'date',
  //   width: '180px'
  // },

  // Status flag
  // {
  //   labelKey: 'User.Status',
  //   field: 'statusFl',
  //   required: false,
  //   isFlag: true,
  //   width: '120px'
  // },

  // Job info
  {
    labelKey: 'User.JobTitle',
    field: 'jobTitle',
    required: false,
    dataType: 'string',
    width: '200px'
  },
  // {
  //   labelKey: 'User.Specialization',
  //   field: 'specialization',
  //   required: false,
  //   dataType: 'string',
  //   width: '200px'
  // },
  // {
  //   labelKey: 'User.ExperienceYears',
  //   field: 'experienceYears',
  //   required: false,
  //   dataType: 'number',
  //   width: '140px'
  // },
  // {
  //   labelKey: 'User.EducationLevel',
  //   field: 'educationLevel',
  //   required: false,
  //   dataType: 'string',
  //   width: '220px'
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


selectedUser: User | null = null;


onUserSelected = (row: User) => {
  this.selectedUser = row;
};

onUserFieldChanged = (e: { field: string; value: any }) => {
  if (!this.selectedUser) return;
  (this.selectedUser as any)[e.field] = e.value;
};

// بعد الحفظ من الفورم: حدّث صف الجدول + selectedUser
onUserSaved = (saved: User) => {
  // لو عندك دالة patchRowById في الجدول:
  // this.table.patchRowById(saved.userPk, saved);

  // أو حدّث الـ selectedUser مباشرة:
  this.selectedUser = { ...(this.selectedUser ?? {}), ...saved };
};





}
