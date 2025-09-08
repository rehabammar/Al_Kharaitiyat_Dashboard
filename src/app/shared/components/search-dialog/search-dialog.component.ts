import { ChangeDetectorRef, Component, ElementRef, HostListener, Inject, Input, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { TableColumn } from '../../../core/models/table-column.interface';
import { SearchServiceFactory } from '../../../core/factories/search-service-factory';
import { SearchService } from '../../../core/services/shared/search.service';

@Component({
  selector: 'app-search-dialog',
  standalone: false,
  templateUrl: './search-dialog.component.html',
  styleUrl: './search-dialog.component.css',
})
export class SearchDialogComponent<T extends Record<string, any>> {

  constructor(
    private dialogRef: MatDialogRef<SearchDialogComponent<T>>,
    @Inject(MAT_DIALOG_DATA) public data: {
      apiEndpoint: string;
      columns: TableColumn[];
      dataFactory: () => T;
      label: string;
     parameter: Record<string, any> ;

    },
    private changeDetectorRef: ChangeDetectorRef,
    private searchFactory: SearchServiceFactory,
  ) { }

  dataSource = new MatTableDataSource<T>([]);
  displayedColumns: string[] = [];
  totalCount: number = 0;
  selectedRow: T | null = null;
  parameter: Record<string, any> = {};


  columns: TableColumn[] = [];
  dataFactory!: () => T;
  label: string = "";

  currentPage = 0;
  pageSize = 10;
  isLoading = false;

  public searchService!: SearchService<T>;

    isHovered: string | null = null;

  filters: Record<string, any> = {};   // e.g. { teacherCourseName: 'شرح' }
  sort: Array<{ property: string; direction: 'asc' | 'desc' }> = [];
  activeSort: { field: string; direction: 'asc' | 'desc' } | null = null;

  lastSelectedId?: number;
  lastPageIndex: number = 0;



  ngOnInit(): void {
    this.label = this.data.label;
    this.searchService = this.searchFactory.create<T>(this.data.apiEndpoint);
    this.columns = this.data.columns;
    this.dataFactory = this.data.dataFactory;
    this.parameter = this.data.parameter ;
    this.displayedColumns = this.columns.map(col => col.field!);

    // if (this.selectedId) {
    //   this.parameter = { [this.searchParameterKey!]: this.selectedId };
    // }

    this.searchService.data$.subscribe((systems: T[]) => {
      this.dataSource.data = systems;
      if (!this.selectedRow && systems.length > 0) {
        this.selectedRow = systems[0];
      }else{
        this.selectedRow = undefined as any;
      }
      this.changeDetectorRef.markForCheck();
    });

    this.searchService.totalElements$.subscribe((count: number) => {
      this.totalCount = count;
      this.changeDetectorRef.markForCheck();
    });
  }

  ngAfterViewInit(): void {
    this.loadData();
  }


  @ViewChild('scrollContainer') container!: ElementRef;
  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    const threshold = 150;
    const position = this.container.nativeElement.scrollTop + this.container.nativeElement.offsetHeight;
    const height = this.container.nativeElement.scrollHeight;
    // console.log("TOTAL COUNT " + this.totalCount);
    // console.log("TOTAL data Source  " + this.dataSource.data.length);



    if (position > height - threshold && !this.isLoading && this.totalCount != this.dataSource.data.length) {
      this.currentPage++;
      this.loadData();
    }
  }




  loadData(): void {
  const pageIndex = this.currentPage ?? 0;
  const pageSize = this.pageSize ?? 10;

  // build the new body shape
  const body = this.buildRequest(pageIndex, pageSize);

  this.searchService.getAll(pageIndex, pageSize, undefined, body).subscribe();
}


  private buildRequest(page: number, size: number) {
  return {
    page,
    size,
    ...this.parameter,           
    ...this.filters,             
    ...(this.sort.length ? { sort: this.sort } : {})
  };
}

getSortClass(field: string, dir: 'asc' | 'desc'): string {
  const s = this.sort[0];
  return s && s.property === field && s.direction === dir
    ? 'sort-arrow active'
    : 'sort-arrow';
}

isSorted(field: string): boolean {
  const s = this.sort[0];
  return !!s && s.property === field;
}

getSortDirection(field: string): 'asc' | 'desc' | null {
  const s = this.sort[0];
  return s && s.property === field ? s.direction : null;
}


  private coerceByType(value: any, dataType?: string) {
  if (value == null || value === '') return '';
  if (dataType === 'number') {
    const n = Number(value);
    return Number.isNaN(n) ? '' : n;
  }
  return String(value).trim();
}



 applyFilter(
  field: string,
  event: Event | null,
  direction: 'asc' | 'desc' = 'asc',
  dataType?: string,
  isSorting: boolean = false
): void {
  if (isSorting) {
    this.activeSort = { field, direction };
    // single-sort; if you want multi-sort, push instead of replace
    this.sort = [{ property: field, direction }];
  } else {
    let value: any = '';
    if (event) {
      const el = event.target as HTMLInputElement | null;
      value = el?.value ?? '';
    }
    const coerced = this.coerceByType(value, dataType);

    if (coerced === '' || coerced == null) {
      delete this.filters[field];
    } else {
      this.filters[field] = coerced;
    }
  }

  this.loadData(); 
}


reset = ()=> {
  this.filters = {};
  this.sort = [];
  this.activeSort = null;
  this.currentPage = 0 ;
  this.loadData();
}

  selectRow(row: T): void {
    this.selectedRow = row;
  }


  search = ()=> {
  }


  confirm = ()=> {
    this.dialogRef.close(this.selectedRow);
  }

  cancel = ()=>{
    this.dialogRef.close(null);
  }


}
