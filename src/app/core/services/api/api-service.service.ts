import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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



@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private loadingService: LoadingService,
    private router: Router

  ) { }

  private handleResponse<T>(response: ApiResponse<T>): ApiResponse<T> {
    if (!response.success) {
      throw new ApiException(response.message);
    }

    return response;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log("handleError" + error.message);
    let errorMsg = 'An unknown error occurred.';

    if (error instanceof ApiException) {
      errorMsg = error.message;
    } else if (error.error instanceof ErrorEvent) {
      errorMsg = `Network error: ${error.error.message}`
    } else {


      if (error.status === 401) {
        //  errorMsg = this.translationService.instant('error.text');
        errorMsg = "عفواً ... انتهت جلسة العمل أو ليس لك صلاحية الدخول لهذه الصفحة";
        this.router.navigate(['/login'], { replaceUrl: true });
      } else {
        errorMsg = `Server error (status ${error.status}): ${error.message}`;
      }
    }


    console.error('HTTP error:', error);
    this.showErrorDialog(errorMsg);
    return throwError(() => new Error(errorMsg));
  }

  private showErrorDialog(message: string): void {

    this.dialog.open(ConfirmPopupComponent, {
          data: {
            message:message,
            showCancel: false,
          }
        });
  }

  get<T>(url: string, params?: any): Observable<ApiResponse<T>> {
    console.log(`[DEBUG] GET Request - URL: ${url}`);

    return this.http.get<ApiResponse<T>>(url, { params }).pipe(
      map(response => this.handleResponse(response)),
      catchError(error => this.handleError(error))
    );
  }

  getImage(url: string, params?: any): Observable<any> {
    console.log(`[DEBUG] GET Image Request - URL: ${url}`);

    return this.http.get(url, {
      responseType: 'blob'
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }



  post<T>(url: string, body: any): Observable<ApiResponse<T>> {
    const startTime = Date.now();
    console.log(`[DEBUG] POST Request - URL: ${url}, Body: ${JSON.stringify(body)}`);

    this.loadingService.show();

    return this.http.post<ApiResponse<T>>(url, body).pipe(
      tap(() => console.log(`[DEBUG] POST Request - Request Time: ${Date.now() - startTime} ms`)),
      map(response => this.handleResponse(response)),
      catchError(error => this.handleError(error)),
      finalize(() => {
        this.loadingService.hide();
        console.log(`[DEBUG] POST Request Completed in ${Date.now() - startTime} ms`);
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

    console.log(`[DEBUG] DELETE Request - URL: ${url}`);

    const startTime = Date.now();
    this.loadingService.show();

    return this.http.delete<ApiResponse<T>>(url).pipe(
      tap(() => console.log(`[DEBUG] DELETE Request - Request Time: ${Date.now() - startTime} ms`)),
      map(response => this.handleResponse(response)),
      catchError(error => this.handleError(error)),
      finalize(() => {
        this.loadingService.hide();
        console.log(`[DEBUG] DELETET Request Completed in ${Date.now() - startTime} ms`);
      })
    );
  }



  downloadFile(url: string, body: any): Observable<Blob> {
    const startTime = Date.now();
    console.log(`[DEBUG] Download File - URL: ${url}, Body: ${JSON.stringify(body)}`);

    this.loadingService.show();

    return this.http.post(url, body, {
      responseType: 'blob',
      observe: 'response'
    }).pipe(
      tap(() => console.log(`[DEBUG] Download File - Time: ${Date.now() - startTime} ms`)),
      map(response => {
        return response.body as Blob;
      }),
      catchError(error => this.handleError(error)),
      finalize(() => {
        this.loadingService.hide();
        console.log(`[DEBUG] Download File Completed in ${Date.now() - startTime} ms`);
      })
    );
  }


}
