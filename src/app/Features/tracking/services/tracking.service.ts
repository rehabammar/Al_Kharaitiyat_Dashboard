import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api/api-service.service';
import { ApiEndpoints } from '../../../core/constants/api-endpoints';
import { Observable, map } from 'rxjs';
import { TeacherTracking } from '../models/teacher-tracking.model';

@Injectable({
  providedIn: 'root'
})
export class TeachersTrackingService {

  constructor(private api: ApiService) {}

  getTodayTeachersStatus(): Observable<TeacherTracking[]> {
    return this.api
      .post<TeacherTracking[]>(
        ApiEndpoints.getTodayTeachersStatus(), 
        {}
      )
      .pipe(map(res => res.data));
  }

  
}
