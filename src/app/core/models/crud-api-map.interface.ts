export interface CrudApiMap {
  GET: () => string;
  ADD?: () => string;
  UPDATE: () => string;
  DELETE?: () => string;
  EXPORT_EXCEL: () => string;
}