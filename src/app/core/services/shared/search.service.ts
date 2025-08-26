import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { tap } from 'rxjs';
import { ApiService } from '../api/api-service.service';
import { LanguageService } from './language.service';
import { ApiPage } from '../../models/api.page.interface';
import { api, ApiEndpoints } from '../../constants/api-endpoints';



export class SearchService<T> {
 private dataSubject = new BehaviorSubject<T[]>([]);
  private totalElementsSubject = new BehaviorSubject<number>(0);

  data$ = this.dataSubject.asObservable();
  totalElements$ = this.totalElementsSubject.asObservable();
  fullPath = ""

  constructor(
    private apiService: ApiService,
    private apiPath : string ,
  ) { 
    this.fullPath = api(apiPath);


  }

  // getAll(page: number, size: number, filters?: any ,  extraParams?: Record<string, any>) {
  //   const requestBody = {
  //     lang: LanguageService.getLanguage()?.langCode,
  //     // page,
  //     // size,
  //     // filters,
  //   };
  //   return this.apiService.post<ApiPage<T>>(this.fullPath, requestBody).pipe(
  //     tap(response => {
  //       this.dataSubject.next(response.data.content);
  //       this.totalElementsSubject.next(response.data.totalElements);
  //     })
  //   );
  // }

  
  getAll(
    pageNumber: number,
    pageSize: number,
    filters?: any,
    extraParams?: Record<string, any>
  ) {
    const requestBody = { "page" : pageNumber, "size":pageSize, filters, ...(extraParams ?? {}) };

    return this.apiService.post<ApiPage<T>>(this.fullPath, requestBody).pipe(
      // handle content + totals here
      tap(res => {
        const page = res.data; // ApiPage<T>
        this.dataSubject.next(page.content);
        this.totalElementsSubject.next(page.totalElements);
      }),
    );
  }


}
