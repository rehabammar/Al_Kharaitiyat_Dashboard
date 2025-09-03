
export interface ApiPage<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  totals: {
  totalAmountPaid: number,
  totalTeacher: number,
  totalCenter: number,
  totalAmount: number,
  totalAmountRemaining: number
  }
}
