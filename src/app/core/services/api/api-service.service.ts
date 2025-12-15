import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
// import { MatDialog } from '@angular/material/dialog';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiException } from './api-exception';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../shared/loading.service';
// import { AlertDialogComponent } from '../../components/alert-dialog-component/alert-popup.component';
// import { TranslationService } from '../shared/translation.service';
import { Router } from '@angular/router';
import { ApiResponse } from '../../models/api-response.interface';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmPopupComponent } from '../../../shared/components/confirm-popup/confirm-popup.component';
import { TranslateService } from '@ngx-translate/core';



@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private loadingService: LoadingService,
    private router: Router,
    private translationService: TranslateService

  ) { }

  private isRedirecting401 = false;
  private errorDialogOpen = false;



  private handleResponse<T>(response: ApiResponse<T>): ApiResponse<T> {
    if (!response.success) {
      throw new ApiException(response.message);
    }

    return response;
  }
  private closeAllDialogs() {
    this.dialog.closeAll();
    this.errorDialogOpen = false;
  }


  private handleError(error: HttpErrorResponse, checkStatusCode: boolean = true): Observable<never> {

    let errorMsg = this.translationService.instant('error.unknown');

    // console.log("=== ERROR OCCURRED ===");
    // console.log(error);

    // استخراج status الحقيقي من HTTP أو body
    const backendStatus =
      error.status ||
      error.error?.data?.statusCode ||
      error.error?.statusCode ||
      null;

    // console.log("Extracted backend status:", backendStatus);

    // استخراج رسالة السيرفر
    if (error instanceof ApiException) {
      errorMsg = error.message;
    } else if (typeof error.error?.message === 'string') {
      errorMsg = error.error.message;
    } else if (error.error instanceof ErrorEvent) {
      errorMsg = `Network error: ${error.error.message}`;
    }

    // ---------------------------
    // 🔥 معالجة 401 Unauthorized
    // ---------------------------
    if (backendStatus === 401 && checkStatusCode) {

      // console.log("401 detected");

      // لا تفتح popup أو تعمل redirect مرتين
      if (!this.isRedirecting401) {
        this.isRedirecting401 = true;

        // اغلاق أي popups مفتوحة لمنع التكرار
        this.dialog.closeAll();

        // ⭐ افتح Popup واحد فقط للمستخدم
        if (!this.errorDialogOpen) {
          this.errorDialogOpen = true;

          const dialogRef = this.dialog.open(ConfirmPopupComponent, {
            data: {
              type: 'error',
              messageKey: 'error.unauthorized',
              details: errorMsg,
              autoCloseMs: 0,
              showCancel: false
            },
            panelClass: 'dialog-error',
            disableClose: true
          });

          // بعد ما المستخدم يقفل الـ popup → روح للّوجين
          dialogRef.afterClosed().subscribe(() => {

            this.errorDialogOpen = false;

            localStorage.removeItem("authToken");
            localStorage.removeItem("userId");

            this.router.navigate(['/login'], { replaceUrl: true });

            setTimeout(() => {
              this.isRedirecting401 = false;
            }, 500);
          });
        }
      }

      return throwError(() => new Error("Unauthorized"));
    }

    // ---------------------------
    // 🔥 باقي الأخطاء العادية
    // ---------------------------
    if (!this.errorDialogOpen) {
      this.errorDialogOpen = true;

      this.dialog.open(ConfirmPopupComponent, {
        data: {
          type: 'error',
          messageKey: 'message.somethingWentWrong',
          details: errorMsg,
          autoCloseMs: 0,
          showCancel: false
        },
        panelClass: 'dialog-error',
        disableClose: true
      }).afterClosed().subscribe(() => {
        this.errorDialogOpen = false;
      });
    }

    return throwError(() => new Error(errorMsg));
  }


  // private showErrorDialog(message: string): void {
  //   this.dialog.open(ConfirmPopupComponent, {
  //     data: {
  //       type: 'error',
  //       messageKey: 'message.somethingWentWrong',
  //       details: message,
  //       autoCloseMs: 0,
  //       showCancel: false
  //     },
  //     panelClass: 'dialog-error',
  //     disableClose: true
  //   });

  // }

  get<T>(url: string, params?: any): Observable<ApiResponse<T>> {
    // console.log(`[DEBUG] GET Request - URL: ${url}`);

    return this.http.get<ApiResponse<T>>(url, { params }).pipe(
      map(response => this.handleResponse(response)),
      catchError(error => this.handleError(error))
    );
  }

  getImage(url: string, params?: any): Observable<any> {
    // console.log(`[DEBUG] GET Image Request - URL: ${url}`);

    return this.http.get(url, {
      responseType: 'blob'
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }



  post<T>(url: string, body: any, options: {
    headers?: HttpHeaders | { [header: string]: string | string[] };
    params?: HttpParams | {
      [param: string]: string | number | boolean
    };
  } = {},
    checkStatusCode: boolean = true
  ): Observable<ApiResponse<T>> {
    // const startTime = Date.now();

    // console.log(`[DEBUG] POST Request - URL: ${url}`);
    // console.log(`[DEBUG] POST Body - ${JSON.stringify(body)}`);
    // console.log(`[DEBUG] POST Headers - ${JSON.stringify(options.headers || {})}`);

    this.loadingService.show();

    return this.http.post<ApiResponse<T>>(url, body, options).pipe(
      // tap(() => console.log(`[DEBUG] POST Request - Request Time: ${Date.now() - startTime} ms`)),
      map(response => this.handleResponse(response)),
      catchError(error => this.handleError(error, checkStatusCode)),
      finalize(() => {
        this.loadingService.hide();
        // console.log(`[DEBUG] POST Request Completed in ${Date.now() - startTime} ms`);
      })
    );
  }

  put<T>(url: string, body: any): Observable<ApiResponse<T>> {
    this.loadingService.show();

    return this.http.put<ApiResponse<T>>(url, body).pipe(
      map(response => this.handleResponse(response)),
      catchError(error => {
        return this.handleError(error);
      }),
      finalize(() => {
        this.loadingService.hide();
      })
    );
  }




  delete<T>(url: string): Observable<ApiResponse<T>> {

    // console.log(`[DEBUG] DELETE Request - URL: ${url}`);

    const startTime = Date.now();
    this.loadingService.show();

    return this.http.delete<ApiResponse<T>>(url).pipe(
      // tap(() => console.log(`[DEBUG] DELETE Request - Request Time: ${Date.now() - startTime} ms`)),
      map(response => this.handleResponse(response)),
      catchError(error => this.handleError(error)),
      finalize(() => {
        this.loadingService.hide();
        // console.log(`[DEBUG] DELETET Request Completed in ${Date.now() - startTime} ms`);
      })
    );
  }



  downloadFile(url: string, body: any): Observable<Blob> {
    const startTime = Date.now();
    // console.log(`[DEBUG] Download File - URL: ${url}, Body: ${JSON.stringify(body)}`);

    this.loadingService.show();

    return this.http.post(url, body, {
      responseType: 'blob',
      observe: 'response'
    }).pipe(
      // tap(() => console.log(`[DEBUG] Download File - Time: ${Date.now() - startTime} ms`)),
      map(response => {
        return response.body as Blob;
      }),
      catchError(error => this.handleError(error)),
      finalize(() => {
        this.loadingService.hide();
        // console.log(`[DEBUG] Download File Completed in ${Date.now() - startTime} ms`);
      })
    );
  }


}
