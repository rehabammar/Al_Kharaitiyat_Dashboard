import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api/api-service.service';
import { ApiEndpoints } from '../../../core/constants/api-endpoints';
import { User } from '../../auth/models/user.model';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { ApiResponse } from '../../../core/models/api-response.interface';
import { ApiPage } from '../../../core/models/api.page.interface';



@Injectable({
  providedIn: 'root'
})
export class HomeService  {

  constructor(private apiService: ApiService  , private router: Router) {
  }

getTeachersList(): Observable<{ items: User[]; total: number }> {
  return this.apiService.post<ApiPage<User>>(ApiEndpoints.getTeachersList(), {})
    .pipe(map(res => ({
      items: res.data.content,
      total: res.data.totalElements
    })));
}



}




