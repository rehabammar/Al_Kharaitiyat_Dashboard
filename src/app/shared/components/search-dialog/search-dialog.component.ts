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
      id: number;
      label: string;
    },
    private changeDetectorRef: ChangeDetectorRef,
    private searchFactory: SearchServiceFactory,
  ) { }

  dataSource = new MatTableDataSource<T>([]);
  displayedColumns: string[] = [];
  filters: Set<any> = new Set();
  totalCount: number = 0;
  selectedRow: T | null = null;
  Id?: number;
  parameter: Record<string, any> = {};


  columns: TableColumn[] = [];
  dataFactory!: () => T;
  label: string = "";

  currentPage = 0;
  pageSize = 10;
  isLoading = false;

  public searchService!: SearchService<T>;



  ngOnInit(): void {
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" + this.data.apiEndpoint);
    this.label = this.data.label;
    this.searchService = this.searchFactory.create<T>(this.data.apiEndpoint);
    this.columns = this.data.columns;
    this.dataFactory = this.data.dataFactory;
    this.Id = this.data.id;
    this.displayedColumns = this.columns.map(col => col.field!);

    if (this.Id) {
      this.parameter = { id: this.Id }
    }
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
    console.log("TOTAL COUNT " + this.totalCount);
    console.log("TOTAL data Source  " + this.dataSource.data.length);



    if (position > height - threshold && !this.isLoading && this.totalCount != this.dataSource.data.length) {
      this.currentPage++;
      this.loadData(Array.from(this.filters), true);
    }
  }




  loadData(filters?: any, append: boolean = false): void {
    this.isLoading = true;

    this.searchService.getAll(this.currentPage, this.pageSize, filters, this.parameter).subscribe(() => {
      this.searchService.data$.pipe(take(1)).subscribe((newItems: T[]) => {
        this.dataSource.data = append ? [...this.dataSource.data, ...newItems] : newItems;

        if (!this.selectedRow && this.dataSource.data.length > 0) {
          this.selectedRow = this.dataSource.data[0];
        }

        this.searchService.totalElements$.pipe(take(1)).subscribe((total: number) => {
          this.totalCount = total;
          this.isLoading = false;
          this.changeDetectorRef.markForCheck();
        });
      });
    });
  }



  applyFilter(
    field: string,
    event: Event | null,
    direction: 'asc' | 'desc' = 'asc',
    dataType?: string,
    isSorting: boolean = false
  ): void {

    let value = "";

    if (event) {
      const inputElement = event.target as HTMLInputElement;
      if (inputElement) {
        value = inputElement.value.trim();
      }
    }

    const newFilter = {
      field: field,
      value: value,
      dataType: dataType,
      sortDirection: isSorting ? direction : ''
    };

    const existingFilterIndex = Array.from(this.filters).findIndex(
      (filter: any) => filter.field === field
    );

    if (isSorting) {
      this.filters = new Set(
        Array.from(this.filters).filter((filter: any) => !filter.sortDirection)
      );

      if (value !== "" || !event) {
        this.filters.add(newFilter);
      }

    } else {
      if (existingFilterIndex !== -1) {
        const existingFilter = Array.from(this.filters)[existingFilterIndex];
        this.filters.delete(existingFilter);
      }

      if (value !== "" || !event) {
        this.filters.add(newFilter);
      }
    }

    this.loadData(Array.from(this.filters));
  }

  selectRow(row: T): void {
    this.selectedRow = row;
  }


  search = ()=> {
  }

  reset = ()=> {
    this.filters.clear();
    this.currentPage = 0;
    this.loadData();

  }



  confirm = ()=> {
    this.dialogRef.close(this.selectedRow);
  }

  cancel = ()=>{
    this.dialogRef.close(null);
  }


}
