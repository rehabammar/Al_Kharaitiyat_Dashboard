import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api/api-service.service';
import { ApiEndpoints } from '../../../core/constants/api-endpoints';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { Organization } from '../model/organization.model';
import { SessionStorageUtil } from '../../../core/util/session-storage';
import { AppConstants } from '../../../core/constants/app_constants';

@Injectable({
  providedIn: 'root'
})
export class PreLoginService {

  constructor(private apiService: ApiService, private router: Router ) {
  }

  getOrganizations(): Observable<Organization> {
    return this.apiService.post<Organization>(ApiEndpoints.getOrganizations(), {"organizationsPk":1})
      .pipe(map(res => {
       SessionStorageUtil.setItem(AppConstants.CURRENT_ORGNIZATION_KEY, res.data);
        return res.data
      }),
      // tap(res => console.log("Orgnization" + JSON.stringify(res)))
    );
  }







}




