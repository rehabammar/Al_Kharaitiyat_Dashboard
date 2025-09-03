import { Observable, BehaviorSubject, tap, map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../api/api-service.service';
import { ApiResponse } from '../../models/api-response.interface';
import { CrudApiMap } from '../../models/crud-api-map.interface';
import { ApiEndpoints } from '../../constants/api-endpoints';
import { LanguageService } from '../shared/language.service';
import { ApiPage } from '../../models/api.page.interface';
import { ConfirmPopupComponent } from '../../../shared/components/confirm-popup/confirm-popup.component';
import { Totals } from '../../models/totals.interface';



export class GenericService<T extends Record<string, any>> {
  private dataSubject = new BehaviorSubject<T[]>([]);
  private totalElementsSubject = new BehaviorSubject<number>(0);
  private totals = new BehaviorSubject<Totals>({
    totalAmountPaid: 0,
    totalTeacher: 0,
    totalCenter: 0,
    totalAmount: 0,
    totalAmountRemaining: 0,
  });

  data$ = this.dataSubject.asObservable();
  totalElements$ = this.totalElementsSubject.asObservable();
  totals$ = this.totals.asObservable();
  private apiMap: CrudApiMap;


  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private apiPath: string,
    private primaryKey: keyof T,
    private searchPath?: string,
    private updatePath?: string,

  ) {
    this.apiMap = ApiEndpoints.buildCrudEndpoints(this.apiPath, this.searchPath, this.updatePath);
    console.table(
      Object.entries(this.apiMap).map(([k, v]) => ({ key: k, type: typeof v }))
    );
  }

  // getAll(pageNumber: number, pageSize: number, filters?: any, extraParams?: Record<string, any>): Observable<ApiResponse<T[]>> {
  //   const requestBody = {
  //     pageNumber,
  //     pageSize,
  //     filters,
  //     parameters: extraParams,
  //   };
  //   return this.apiService.post<T[]>(this.apiMap.GET(), requestBody).pipe(
  //     tap(response => {
  //       this.dataSubject.next(response.data);
  //       this.totalElementsSubject.next(response.totalElements);
  //     })
  //   );
  // }


  getAll(
    pageNumber: number,
    pageSize: number,
    filters?: any,
    extraParams?: Record<string, any>
  ) {
    const requestBody = { "page": pageNumber, "size": pageSize, filters, ...(extraParams ?? {}) };

    return this.apiService.post<ApiPage<T>>(this.apiMap.GET(), requestBody).pipe(
      // handle content + totals here
      tap(res => {
        const page = res.data; // ApiPage<T>
        this.dataSubject.next(page.content);
        this.totalElementsSubject.next(page.totalElements);
        this.totals.next(page.totals ?? {});
      }),
    );
  }




  add(item: T): Observable<T> {
    return this.apiService.post<T>(this.apiMap.ADD!(), item).pipe(
      tap(response => {
        console.log("INSERT ITEMS" + JSON.stringify(response.data));
        const updated = [response.data, ...this.dataSubject.getValue()];
        this.dataSubject.next(updated);
        this.totalElementsSubject.next(updated.length);
        this.showSuccessPopup()
      }),
      map((res) => res.data)
    );
  }

  update(item: T): Observable<T> {
    const obj: Record<string, any> = item;
    obj['id'] = obj[this.primaryKey as string];
    return this.apiService.post<T>(this.apiMap.UPDATE(), obj).pipe(
      tap(response => {
        const updated = this.dataSubject.getValue().map(existing =>
          existing[this.primaryKey] === response.data[this.primaryKey] ? response.data : existing
        );
        this.dataSubject.next(updated);
        this.showSuccessPopup()
      }),
      map((res) => res.data)
    );
  }

  delete(deletedItem: T): Observable<any> {
    return this.apiService.post<any>(this.apiMap.DELETE!(), deletedItem).pipe(
      tap(() => {
        const filtered = this.dataSubject.getValue().filter(item => item[this.primaryKey] !== deletedItem[this.primaryKey]);
        this.dataSubject.next(filtered);
        this.showSuccessPopup()
      })
    );
  }

  save(item: T): Observable<T> {
    const newItem = {
      ...item,
      languagesFk: LanguageService.getLanguage()?.langCode
    };

    // console.log("SAVE PRIMARY KEY " + JSON.stringify(newItem));
    if (item[this.primaryKey]) {
      return this.update(newItem);
    } else {
      return this.add(newItem);
    }
  }




  exportToExcel(pageNumber: number, pageSize: number, columns: any, filters?: any, extraParams?: Record<string, any>) {
    const requestBody = {
      voPkgName: "sso.model.vo.",
      // isRtl: this.langProvider.getRtlFlag() == 1 ? true : false,
      pageNumber,
      pageSize,
      filters,
      parameters: extraParams,
      columns: columns
    };
    this.apiService.downloadFile(this.apiMap.EXPORT_EXCEL(), requestBody).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // a.download = 'report.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });

  }

  showSuccessPopup() {
    this.dialog.open(ConfirmPopupComponent, {
      data: {
        message: 'message.success',
        showCancel: false,
      }
    });

  }








}
