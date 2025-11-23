// pre-login/services/organization-store.service.ts (أو استعملي نفس ملف PreLoginService)
import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api/api-service.service';
import { ApiEndpoints } from '../../../core/constants/api-endpoints';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, finalize, shareReplay } from 'rxjs/operators';
import { Organization } from '../model/organization.model';
import { SessionStorageUtil } from '../../../core/util/session-storage';
import { AppConstants } from '../../../core/constants/app_constants';
import { User } from '../../auth/models/user.model';

@Injectable({ providedIn: 'root' })
export class PreLoginService {

  constructor(private api: ApiService) { }


  private readonly initial: Organization | null =
    SessionStorageUtil.getItem(AppConstants.CURRENT_ORGNIZATION_KEY) ?? null;

  private readonly orgSubject = new BehaviorSubject<Organization | null>(this.initial);
  readonly organization$ = this.orgSubject.asObservable().pipe(shareReplay({ bufferSize: 1, refCount: true }));

  get organization(): Organization | null { return this.orgSubject.value; }

  private inFlight$?: Observable<Organization>;


  load(force = false): Observable<Organization> {
    const current = this.orgSubject.value;

    if (!force && current) {
      // عندنا داتا بالفعل
      return of(current);
    }

    if (!force && this.inFlight$) {
      // طلب جارٍ بالفعل — اشترك فيه بدل طلب جديد
      return this.inFlight$;
    }

    const req$ = this.api
      .post<Organization>(ApiEndpoints.getOrganizations(), { organizationsPk: 1 })
      .pipe(
        map(res => res.data),
        tap(org => this.set(org)),
        finalize(() => (this.inFlight$ = undefined)),
        shareReplay(1)
      );

    if (!force) this.inFlight$ = req$;

    return req$;
  }

  refresh(): Observable<Organization> {
    return this.load(true);
  }

  refreshNow(): void {
    this.load(true).subscribe();
  }

  private set(org: Organization | null) {
    this.orgSubject.next(org);
    if (org) {
      SessionStorageUtil.setItem(AppConstants.CURRENT_ORGNIZATION_KEY, org);
    } else {
      SessionStorageUtil.removeItem(AppConstants.CURRENT_ORGNIZATION_KEY);
    }
  }

  patch(partial: Partial<Organization>) {
    const curr = this.orgSubject.value ?? new Organization();
    const next = new Organization({ ...curr, ...partial });
    this.set(next);
  }

  patchImagesFromResponse(res: any) {
    if (!res) return;

    const patch: Partial<Organization> = {};

    // دعم logoFullUrl/ logoUrl
    if ('logoFullUrl' in res || 'logoUrl' in res) {
      const logo = res.logoFullUrl ?? res.logoUrl ?? null;
      (patch as any).logoFullUrl = logo;
      (patch as any).logoUrl = logo;
    }

    // السلايدر
    ([
      'sliderImg1FullUrl',
      'sliderImg2FullUrl',
      'sliderImg3FullUrl',
      'sliderImg4FullUrl',
      'sliderImg5FullUrl'
    ] as const).forEach(k => {
      if (k in res) (patch as any)[k] = res[k] ?? null;
    });

    this.patch(patch);
  }

  /** مسح الكاش بالكامل (اختياري) */
  clear() {
    this.set(null);
  }


  // ================== get Users && update User ==================

 
  login(username: string, password: string): Observable<User> {
    const loginRequestBody = {
      username: username,
      password: password,
    };

    return this.api.post<User>(ApiEndpoints.userLogin(), loginRequestBody, {} , false)
      .pipe(
        map((response) => response.data)
      );
  }
  

   updateUser(user : User): Observable<User> {
    return this.api.post<User>(ApiEndpoints.updateUser(), user , {headers: { Authorization: `Bearer ${user.authToken}`,}})
      .pipe(
        map((response) => response.data)
      );
  }

}
