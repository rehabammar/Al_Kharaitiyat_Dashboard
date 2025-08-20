import { Inject, Injectable } from "@angular/core";
import { ApiService } from "../services/api/api-service.service";
import { SearchService } from "../services/shared/search.service";


@Injectable({ providedIn: 'root' })
export class SearchServiceFactory {
  constructor(
    private apiService: ApiService,
  ) {}

  create<T extends Record<string, any>>(
    apiPath: string,
  ): SearchService<T> {
    return new SearchService<T>(
      this.apiService,
      apiPath,
    );
  }
}
