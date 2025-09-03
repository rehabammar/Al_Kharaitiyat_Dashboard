import { Totals } from "./totals.interface";

export interface ApiPage<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  totals: Totals;
}
