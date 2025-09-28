import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  ViewChild,
  HostListener,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { TableColumn } from '../../../core/models/table-column.interface';
import { SearchServiceFactory } from '../../../core/factories/search-service-factory';
import { SearchService } from '../../../core/services/shared/search.service';

@Component({
  selector: 'app-search-dialog',
  standalone: false,
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.css'],
})
export class SearchDialogComponent<T extends Record<string, any>>
  implements OnInit, AfterViewInit
{
  constructor(
    private dialogRef: MatDialogRef<SearchDialogComponent<T>>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      apiEndpoint: string;
      columns: TableColumn[];
      dataFactory: () => T;
      label: string;
      parameter: Record<string, any>;
    },
    private changeDetectorRef: ChangeDetectorRef,
    private searchFactory: SearchServiceFactory
  ) {}

  dataSource = new MatTableDataSource<T>([]);
  displayedColumns: string[] = [];
  totalCount = 0;
  selectedRow: T | null = null;

  parameter: Record<string, any> = {};
  columns: TableColumn[] = [];
  dataFactory!: () => T;
  label = '';

  currentPage = 0;
  pageSize = 10;
  isLoading = false;

  /** when true, the next incoming page will be appended instead of replaced */
  private pendingAppend = false;

  public searchService!: SearchService<T>;

  // hover state (optional for UI)
  isHovered: string | null = null;

  // filters/sort
  filters: Record<string, any> = {};
  sort: Array<{ property: string; direction: 'asc' | 'desc' }> = [];
  activeSort: { field: string; direction: 'asc' | 'desc' } | null = null;

  @ViewChild('scrollContainer') container!: ElementRef;

  ngOnInit(): void {
    this.label = this.data.label;
    this.searchService = this.searchFactory.create<T>(this.data.apiEndpoint);
    this.columns = this.data.columns;
    this.dataFactory = this.data.dataFactory;
    this.parameter = this.data.parameter || {};
    this.displayedColumns = this.columns.map((col) => col.field!);

    // Subscribe to data stream
    this.searchService.data$.subscribe((systems: T[]) => {
      if (!Array.isArray(systems)) return;

      if (this.pendingAppend) {
        // append next page
        const merged = [...(this.dataSource.data || []), ...systems];
        this.dataSource.data = merged;
      } else {
        // first page or fresh query -> replace
        this.dataSource.data = systems;

        // set initial selection only on fresh load
        if (!this.selectedRow && systems.length > 0) {
          this.selectedRow = systems[0];
        }
      }

      // reset append flag for next cycle
      this.pendingAppend = false;

      this.changeDetectorRef.markForCheck();
    });

    // Subscribe to total count
    this.searchService.totalElements$.subscribe((count: number) => {
      this.totalCount = count ?? 0;
      this.changeDetectorRef.markForCheck();
    });
  }

  ngAfterViewInit(): void {
    this.loadData();
  }

  // If your template binds (scroll) on a specific container, keep this method
  // and call it from there. If you want to rely on host/window scrolling,
  // switch the decorator to: @HostListener('window:scroll', ['$event'])
  @HostListener('scroll', ['$event'])
  onScroll(_event: any) {
    if (!this.container?.nativeElement) return;

    const threshold = 150;
    const el = this.container.nativeElement as HTMLElement;
    const position = el.scrollTop + el.offsetHeight;
    const height = el.scrollHeight;

    const reachedBottom = position > height - threshold;
    const moreToLoad =
      this.totalCount > 0 && this.dataSource.data.length < this.totalCount;

    if (reachedBottom && moreToLoad && !this.isLoading) {
      this.currentPage++;
      this.loadData();
    }
  }

  /** Fetch current page with current filters/sort/parameters */
  loadData(): void {
    if (this.isLoading) return; // avoid parallel calls
    this.isLoading = true;

    const pageIndex = this.currentPage ?? 0;
    const pageSize = this.pageSize ?? 10;

    // mark this fetch as append if page > 0
    this.pendingAppend = pageIndex > 0;

    const body = this.buildRequest(pageIndex, pageSize);

    this.searchService
      .getAll(pageIndex, pageSize, undefined, body)
      .pipe(take(1))
      .subscribe({
        next: () => {},
        error: () => {
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  /** Build backend request body */
  private buildRequest(page: number, size: number) {
    return {
      page,
      size,
      ...this.parameter, // extra params from caller
      ...this.filters, // current filters
      ...(this.sort.length ? { sort: this.sort } : {}),
    };
  }

  // ---------- Sorting UI helpers ----------
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

  // ---------- Filtering / Sorting ----------
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
      // single sort (replace); for multi-sort, push instead
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

    // new query → reset paging & data, then load page 0
    this.currentPage = 0;
    this.dataSource.data = [];
    this.pendingAppend = false;
    this.loadData();
  }

  reset = () => {
    this.filters = {};
    this.sort = [];
    this.activeSort = null;
    this.currentPage = 0;
    this.dataSource.data = [];
    this.pendingAppend = false;
    this.loadData();
  };

  // ---------- Selection & dialog ----------
  selectRow(row: T): void {
    this.selectedRow = row;
  }

  search = () => {
    // optional search button, if you have one
  };

  confirm = () => {
    this.dialogRef.close(this.selectedRow);
  };

  cancel = () => {
    this.dialogRef.close(null);
  };
}
