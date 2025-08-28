import { Injectable, Input } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { ApiService } from '../../../core/services/api/api-service.service';
import { ApiEndpoints } from '../../../core/constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class FinancialTransactionsService {


  constructor(private apiService: ApiService) {}

  payAllTransactions(data: any): Observable<boolean> {
    return this.apiService.post(ApiEndpoints.payAllFinancialTransactions(), data).pipe(
      map(() => true), 
      catchError(() => of(false)) 
    );
  }

    payAllFinancialTransactionsforStudent(data: any): Observable<boolean> {
    return this.apiService.post(ApiEndpoints.payAllFinancialTransactionsforStudent(), data).pipe(
      map(() => true), 
      catchError(() => of(false)) 
    );
  }
}