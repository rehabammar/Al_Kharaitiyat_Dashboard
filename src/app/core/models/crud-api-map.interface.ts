export interface CrudApiMap {
  GET: () => string;
  ADD?: () => string;
  UPDATE: () => string;
  UPDATE_ALL: () => string;
  DELETE?: () => string;
  EXPORT_EXCEL: () => string;
}