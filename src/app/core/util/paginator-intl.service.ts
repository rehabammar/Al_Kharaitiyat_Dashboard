import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable(
{
  providedIn:'root'
}
)
export class CustomPaginatorIntl extends MatPaginatorIntl {

  override itemsPerPageLabel = 'العناصر في الصفحة:';
  override nextPageLabel = 'التالي';
  override previousPageLabel = 'السابق';
  override firstPageLabel = 'الأول';
  override lastPageLabel = 'الأخير';

  private direction: 'ltr' | 'rtl' = 'rtl';

  setDirection(direction: 'ltr' | 'rtl'): void {
    this.direction = direction;

    if (this.direction === 'rtl') {
      this.itemsPerPageLabel = 'العناصر في الصفحة:';
      this.nextPageLabel = 'التالي';
      this.previousPageLabel = 'السابق';
      this.firstPageLabel = 'الأول';
      this.lastPageLabel = 'الأخير';
    } else {
      this.itemsPerPageLabel = 'Items per page:';
      this.nextPageLabel = 'Next';
      this.previousPageLabel = 'Previous';
      this.firstPageLabel = 'First';
      this.lastPageLabel = 'Last';
    }

    this.changes.next();
  }

  override getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0) {
      return this.direction === 'rtl' ? 'لا توجد سجلات' : 'No records';
    }

    const startIndex = page * pageSize;
    const endIndex = Math.min(startIndex + pageSize, length);
    
    return this.direction === 'rtl'
      ? `${startIndex + 1} - ${endIndex} من ${length}`
      : `${startIndex + 1} - ${endIndex} of ${length}`;
  };
}
