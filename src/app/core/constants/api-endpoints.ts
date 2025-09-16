import { environment } from '../../../environments/environment';

const trimSlashes = (s: string) => s.replace(/^\/+|\/+$/g, '');

// smart join: يدعم apiBase النسبي والمطلق
const smartJoin = (...parts: string[]) => {
  const clean = parts.map(p => trimSlashes(String(p)));
  if (/^https?:\/\//i.test(clean[0])) {
    const [first, ...rest] = clean;
    return first + (rest.length ? '/' + rest.join('/') : '');
  }
  return '/' + clean.filter(Boolean).join('/');
};

const API_BASE = environment.apiBase;                 // '/api' أو 'https://api-.../api'
const baseUrl  = smartJoin(API_BASE, 'ecenter');      // '/api/ecenter' أو 'https://.../api/ecenter'

// ========= helpers =========
export function api(path: string): string {
  return smartJoin(baseUrl, path);
}

// /api/* مباشرة (مش تحت ecenter)
export function apiRoot(path: string): string {
  return smartJoin(API_BASE, path);
}

// ========= endpoints =========
export class ApiEndpoints {

  static buildCrudEndpoints = (basePath: string, searchPath?: string, updatePath?: string) => ({
    GET:          () => api(`${basePath}/${searchPath ?? 'search'}`),
    ADD:          () => api(`${basePath}/save`),
    UPDATE:       () => api(`${basePath}/${updatePath ?? 'update'}`),
    DELETE:       () => api(`${basePath}/delete`),
    EXPORT_EXCEL: () => api(`${basePath}/excel`)
  });

  static userApi = api('users'); // بدل `${baseUrl}/users`

  // ✅ إصلاح: استخدم apiRoot + ترميز
  static getImage = (path: string) => apiRoot(`images/getImage?path=${encodeURIComponent(path)}`);

  static userLogin                 = () => api('register/auth/loginAdmins');
  static resetPasswordRequest      = () => api('users/request-reset-password');
  static resetPasswordVerification = () => api('users/reset-password-verification');
  static resetPassword             = () => api('users/reset-password');

  static accountActivation         = () => api('users/activate');
  static resendActivationCode      = () => api('users/resend-activation-code');

  static changePassword            = () => api('users/change-password');
  static changeUserProfilePicture  = () => api('users/upload-profile-picture');
  static saveNewStudent            = () => api('users/save-student');

  static getOrganizations          = () => api('organizations/getById');

  static appLookups                = (p: string) => api(`lookupDetails${p}`);
  static getCountries              = () => api('countries/countries');

  static getTeacherCourses         = () => api('teacherCourses/getByTeacherFk');
  static getTeacherCoursesById     = () => api('teacherCourses/getById');

  static getTeacherCoursesEvaluation = () => api('teacherCourses/teacher-review-summary');
  static getOverallEvaluation        = () => api('teacherCourses/teacher-overall-review');

  static getCourseClasses          = () => api('classes/search');
  static getCourseStudents         = () => api('courseStudents/search');
  static addStudentsToCourse       = () => api('courseStudents/save-multiple');
  static deleteStudentFromCourse   = () => api('courseStudents/delete');
  static deleteStudentsFromCourse  = () => api('courseStudents/delete-multiple');

  static saveClass                 = () => api('classes/save');
  static updateClass               = () => api('classes/update');
  static startClass                = () => api('classes/start-class');
  static endClass                  = () => api('classes/end-class');
  static cancelClass               = () => api('classes/cancel-class');
  static getClassById              = () => api('classes/getById');

  static uploadClassAttachments    = () => api('class-attachments/upload-multiple');
  static getClassAttachments       = () => api('class-attachments/get-attachment-by-class');
  static deleteClassAttachment     = () => api('class-attachments/delete');
  static updateClassAttachmentInfo = () => api('class-attachments/update-attachment-info');
  static downloadClassAttachment   = () => api('class-attachments/download');

  static getClassAttendance        = () => api('studentAttendanceClasses/search');
  static addClassAttendance        = () => api('studentAttendanceClasses/save-multiple');
  static updateClassStudents       = () => api('studentAttendanceClasses/update-multiple');
  static deleteClassStudents       = () => api('studentAttendanceClasses/delete-multiple');
  static studentAttendance         = () => api('studentAttendanceClasses/single-student-attendance');

  static getStudentsNotAttended    = () => api('users/findStudentsNotInClass');
  static getStudentsNotInCourse    = () => api('users/findStudentsNotInCourse');

  static getPayersByClass          = () => api('financialTransactions/get-payers-by-class');
  static studentPayment            = () => api('financialTransactions/student-payment');

  static teacherDueTransactions    = () => api('financialTransactions/search-outstanding-transactions');
  static notPaidTransactions       = () => api('financialTransactions/search-user-outstanding');
  static paidToUserTransactions    = () => api('financialTransactions/search-paid-to_user_transactions');
  static paidFromUserTransactions  = () => api('financialTransactions/search-paid-from-user-transactions');

  static userPaymentsSummary       = () => api('financialTransactions/user-payments-summary');

  static getTeacherQualifications  = () => api('teacherQualifications/search');
  static uploadCertificate         = () => api('teacherQualifications/upload-certificate');
  static deleteCertificate         = () => api('teacherQualifications/delete');

  static generateAppReports        = () => api('reports/generate');

  static getStudentCourses         = () => api('courseStudents/getStudentCourses');
  static getStudentClasses         = () => api('classes/all-classes-by-student');

  static getAllCourses             = () => api('courseStudents/getAvailableCoursesForStudent');
  static registerInCourse          = () => api('courseStudents/student-course-register');

  static getStages                 = () => api('stages/searchAll');
  static getLevels                 = () => api('levels/searchAll');

  static getClassEvaluation        = () => api('studentAttendanceClasses/search');
  static updateClassEvaluation     = () => api('studentAttendanceClasses/update-teacher-review');

  static getNotificationList       = () => api('notifications/search');
  static updateNotification        = () => api('notifications/update');

  static systemLogs                = () => api('system-logs/save');

  // Lookups (قيم تمرر لـ appLookups)
  static genderLookup              = '/gender';
  static subjectsLookup            = '/subjects';
  static userTypeLookup            = '/userType';
  static courseLocationLookup      = '/courseLocation';
  static qualificationType         = '/qualification-type';
  static findStudentsNotInCourse   = '/users/findStudentsNotInCourse';
  static findStudentsNotInClass    = '/users/findStudentsNotInClass';
  static getAllUsers               = '/users/search';

  static getTeachersList           = () => api('users/search-teachers');
  static getTeachersListForDashboard = () => api('users/search-teachers-dashboard');

  static getMonthlyfinancialTransactions = () => api('financialTransactions/monthly-academic-payment-dashboard');
  static getDailyClassSummary            = () => api('classes/all-classes-today-for-dashboard');

  static payAllFinancialTransactions          = () => api('financialTransactions/pay-all-from-payer-to-payee');
  static payAllFinancialTransactionsforStudent = () => api('financialTransactions/pay-all-from-payer-to-payee-from-student');
  static payAllFinancialTransactionsforTeacher = () => api('financialTransactions/pay-all-from-payer-to-payee-from-teacher');

  static totalOutstandingForUser = () => api('financialTransactions/total-outstanding-for-user');
  static totalOutstandingOnUser  = () => api('financialTransactions/total-outstanding-on-user');

  static updateImageOrganization  = () => api('organizations/update-with-images');


}
