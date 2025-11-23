import { Inject, Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { CrudMapProvider } from "../models/crud-map-provider.interface";
import { GenericService } from "../services/crud/generic.service";
import { ApiService } from "../services/api/api-service.service";

@Injectable({ providedIn: 'root' })
export class GenericServiceFactory {
  constructor(
    private apiService: ApiService,
    private dialog :MatDialog,
  ) {}

  create<T extends Record<string, any>>(
    apiPath: string , 
    primaryKey: keyof T,
    searchPath?: string , 
    updatePath?: string,
    updateAllPath?: string,
    exportPath?: string,


  ): GenericService<T> {
    return new GenericService<T>(
      this.apiService,
      this.dialog,
      apiPath,
      primaryKey ,
      searchPath,
      updatePath,
      updateAllPath,
      exportPath
     
    );
  }
}
