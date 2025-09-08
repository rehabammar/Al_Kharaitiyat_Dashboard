import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api/api-service.service';
import { ApiEndpoints } from '../../../core/constants/api-endpoints';
import { User } from '../../auth/models/user.model';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { ApiResponse } from '../../../core/models/api-response.interface';
import { ApiPage } from '../../../core/models/api.page.interface';
import { MonthlyCollection } from '../models/monthly-collection.model';
import { DailyClassSummary } from '../models/daily-class-summary.model';
import { Class } from '../../courses/models/class.model';
import { formatDate } from '@angular/common';



@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private apiService: ApiService, private router: Router) {
  }

  getTeachersList(): Observable<{ items: User[]; total: number }> {
    return this.apiService.post<ApiPage<User>>(ApiEndpoints.getTeachersListForDashboard(), {})
      .pipe(map(res => ({
        items: res.data.content,
        total: res.data.totalElements
      })));
  }



  getMonthlyfinancialTransactions(): Observable<MonthlyCollection[]> {
    return this.apiService.post<MonthlyCollection[]>(ApiEndpoints.getMonthlyfinancialTransactions(), {})
      .pipe(map(res => res.data));
  }


  getDailyClassSummary(): Observable<DailyClassSummary> {
    return this.apiService.post<DailyClassSummary>(ApiEndpoints.getDailyClassSummary(), {})
      .pipe(
        // tap(res => console.log('Daily summary RAW response:', res.data)),   // logs the whole API response
        map(res => res.data));
  }


  getDailyClasses(): Observable<Class[]> {
    const todayStr = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    return this.apiService.post<ApiPage<Class>>(ApiEndpoints.getCourseClasses(), { "expectedStartTime": todayStr })
      .pipe(
        map(res => res.data.content));
  }







}




