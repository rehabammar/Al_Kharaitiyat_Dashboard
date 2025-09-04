export class TeacherQualification {
  qualificationPk!: number | null;

  teacherFk!: number | null;        
  teacherName!: string | null;

  title!: string | null;                  
  qualificationTypeFk!: number | null;    
  qualificationTypeFkName!: string | null;

  major!: string | null;            
  institutionName!: string | null;        
  issueDate!: string | null;             

  organizationFk!: number | null;
  organizationFkName!: string | null;

  certificateFile!: string | null;        
  certificateFileUrl!: string | null;     

  notes!: string | null;

  createdBy!: number | null;
  creationDate!: string | null;
  modifiedBy!: number | null;
  modifiedDate!: string | null;

  constructor(init?: Partial<TeacherQualification>) {
    Object.assign(this, init);
  }
}
