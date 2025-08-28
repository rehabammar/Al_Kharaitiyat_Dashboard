// src/app/core/constants/api-endpoints.ts

const baseUrl = 'http://157.180.65.178:8080/api/ecenter';
// const baseUrl = 'http://localhost:8080/api/ecenter';


export function api(path: string): string {
  return `${baseUrl}${path}`;
}

export class ApiEndpoints {

  // Generic CRUD endpoint builder for common operations
static buildCrudEndpoints = (basePath: string  , searchPath?: string , updatePath?:string) => ({
  GET: () => api(`/${basePath}/${searchPath ?? 'search'}`),
  ADD: () => api(`/${basePath}/save`),
  UPDATE: () => api(`/${basePath}/${updatePath ?? 'update'}`),
  DELETE: () => api(`/${basePath}/delete`),
  EXPORT_EXCEL: () => api(`/${basePath}/excel`)
});


  static userApi = `${baseUrl}/users`;

  static getImage = (path: string) => api(`/api/images/getImage?path=${path}`);
  static userLogin = () => api('/register/auth/loginAdmins');
  static resetPasswordRequest = () => api('/users/request-reset-password');
  static resetPasswordVerification = () => api('/users/reset-password-verification');
  static resetPassword = () => api('/users/reset-password');

  static accountActivation = () => api('/users/activate');
  static resendActivationCode = () => api('/users/resend-activation-code');

  static changePassword = () => api('/users/change-password');
  static changeUserProfilePicture = () => api('/users/upload-profile-picture');
  static saveNewStudent = () => api('/users/save-student');

  static getOrganizations = () => api('/organizations/getById');

  static appLookups = (path: string) => api(`/lookupDetails${path}`);
  static getCountries = () => api('/countries/countries');

  static getTeacherCourses = () => api('/teacherCourses/getByTeacherFk');
  static getTeacherCoursesById = () => api('/teacherCourses/getById');

  static getTeacherCoursesEvaluation = () => api('/teacherCourses/teacher-review-summary');
  static getOverallEvaluation = () => api('/teacherCourses/teacher-overall-review');

  static getCourseClasses = () => api('/classes/search');
  static getCourseStudents = () => api('/courseStudents/search');
  static addStudentsToCourse = () => api('/courseStudents/save-multiple');
  static deleteStudentFromCourse = () => api('/courseStudents/delete');
  static deleteStudentsFromCourse = () => api('/courseStudents/delete-multiple');

  static saveClass = () => api('/classes/save');
  static updateClass = () => api('/classes/update');
  static startClass = () => api('/classes/start-class');
  static endClass = () => api('/classes/end-class');
  static cancelClass = () => api('/classes/cancel-class');
  static getClassById = () => api('/classes/getById');

  static uploadClassAttachments = () => api('/class-attachments/upload-multiple');
  static getClassAttachments = () => api('/class-attachments/get-attachment-by-class');
  static deleteClassAttachment = () => api('/class-attachments/delete');
  static updateClassAttachmentInfo = () => api('/class-attachments/update-attachment-info');
  static downloadClassAttachment = () => api('/class-attachments/download');

  static getClassAttendance = () => api('/studentAttendanceClasses/search');
  static addClassAttendance = () => api('/studentAttendanceClasses/save-multiple');
  static updateClassStudents = () => api('/studentAttendanceClasses/update-multiple');
  static deleteClassStudents = () => api('/studentAttendanceClasses/delete-multiple');
  static studentAttendance = () => api('/studentAttendanceClasses/single-student-attendance');

  static getStudentsNotAttended = () => api('/users/findStudentsNotInClass');
  static getStudentsNotInCourse = () => api('/users/findStudentsNotInCourse');

  static getPayersByClass = () => api('/financialTransactions/get-payers-by-class');
  static studentPayment = () => api('/financialTransactions/student-payment');

  static teacherDueTransactions = () => api('/financialTransactions/search-outstanding-transactions');
  static notPaidTransactions = () => api('/financialTransactions/search-user-outstanding');
  static paidToUserTransactions = () => api('/financialTransactions/search-paid-to_user_transactions');
  static paidFromUserTransactions = () => api('/financialTransactions/search-paid-from-user-transactions');

  static userPaymentsSummary = () => api('/financialTransactions/user-payments-summary');

  static getTeacherQualifications = () => api('/teacherQualifications/search');
  static uploadCertificate = () => api('/teacherQualifications/upload-certificate');
  static deleteCertificate = () => api('/teacherQualifications/delete');

  static generateAppReports = () => api('/reports/generate');

  static getStudentCourses = () => api('/courseStudents/getStudentCourses');
  static getStudentClasses = () => api('/classes/all-classes-by-student');

  static getAllCourses = () => api('/courseStudents/getAvailableCoursesForStudent');
  static registerInCourse = () => api('/courseStudents/student-course-register');

  static getStages = () => api('/stages/searchAll');
  static getLevels = () => api('/levels/searchAll');

  static getClassEvaluation = () => api('/studentAttendanceClasses/search');
  static updateClassEvaluation = () => api('/studentAttendanceClasses/update-teacher-review');

  static getNotificationList = () => api('/notifications/search');
  static updateNotification = () => api('/notifications/update');

  static systemLogs = () => api('/system-logs/save');

  // Lookups
  static genderLookup = '/gender';
  static subjectsLookup = '/subjects';
  static userTypeLookup = '/userType';
  static courseLocationLookup = '/courseLocation';
  static qualificationType = '/qualification-type';
  static findStudentsNotInCourse = '/users/findStudentsNotInCourse';
  static findStudentsNotInClass = '/users/findStudentsNotInClass';


//  static getStudentsList = '/users/search-students' ;

 
  static getTeachersList = () => api('/users/search-teachers');

  static getMonthlyfinancialTransactions =()=>api('/financialTransactions/monthly-academic-payment-dashboard');
  
  static getDailyClassSummary =()=>api('/classes/all-classes-today-for-dashboard');

  static payAllFinancialTransactions =()=>api('/financialTransactions/pay-all-from-payer-to-payee');
  static payAllFinancialTransactionsforStudent =()=>api('/financialTransactions/pay-all-from-payer-to-payee-from-student');

  

  


}
