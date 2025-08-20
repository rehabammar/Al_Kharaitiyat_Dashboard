import { CrudApiMap } from "./crud-api-map.interface";

export interface CrudMapProvider {
  getCrudMap(entityName: string ,  apiPath : string): CrudApiMap;
}
