import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SearchServiceFactory } from '../../../core/factories/search-service-factory';
import { SearchService } from '../../../core/services/shared/search.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-combobox-search',
  standalone: false,
  templateUrl: './combobox-search.component.html',
  styleUrl: './combobox-search.component.css' ,
})
export class ComboboxSearchComponent<T extends Record<string, any> > implements OnInit  , OnChanges , OnDestroy{
  [x: string]: any;

  @Input() apiPath!: string;
  @Input() dataFactory!: () => T;
  @Input() primaryKey!: keyof T;
  @Input() displayItemKey!: keyof T;
  @Input() set selectedKey(val: any) {
    this._selectedKey = val;
    this.tryApplySelection(); 
  } 
  @Input() hasError = false;
  @Output() itemSelected = new EventEmitter<T | null>();
  @Output() selectedKeyChange = new EventEmitter<any>();  


  currentPage = 0;
  pageSize = 10;

  items: T[] = []

  searchService!: SearchService<T>;
  private _selectedKey: any = null;


  private destroy$ = new Subject<void>();

  private static cache: Record<string, any[]> = {};
  constructor(private searchFactory: SearchServiceFactory, private dialog: MatDialog , private dir : ChangeDetectorRef) { }

  readonly MORE_OPTION = '__MORE_OPTION__' as const;

    get selectedKey() { return this._selectedKey; }



  ngOnInit(): void {
    this.searchService = this.searchFactory.create<T>(this.apiPath);
    this.loadData();
  }

 
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['apiPath'] && !changes['apiPath'].firstChange) {
      this.searchService = this.searchFactory.create<T>(this.apiPath);
      this.items = [];
      this.selected = null;
      this.loadData();  // هيحاول يطبّق selectedKey بعد التحميل
    }
    if (changes['selectedKey'] && !changes['selectedKey'].firstChange) {
      this.tryApplySelection(); // يعيد مطابقة المفتاح مع العناصر
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

selected: T | null | typeof this.MORE_OPTION = null;

onSelect(value: T | null | typeof this.MORE_OPTION) {
  if (value === this.MORE_OPTION) {
    this.openSearchDialog();
    this.selected = null;
    return;
  }

  
  this.selected = (value as T) ?? null;

    // ابعت العنصر المختار بالكامل
  this.itemSelected.emit(this.selected);

    // وابعت الـ key عشان two-way binding
  const pk = this.primaryKey;
  const key = this.selected ? (this.selected as any)[pk] : null;
  this._selectedKey = key;
  this.selectedKeyChange.emit(key);

}

  loadData(): void {
    const cached = ComboboxSearchComponent.cache[this.apiPath];
    if (cached?.length) {
      this.items = cached;
      this.tryApplySelection();
      return;
    }
    this.searchService.getAll(this.currentPage, this.pageSize,).subscribe(() => {
      this.searchService.data$.subscribe((responceData: T[]) => {
        this.items = responceData;
        this.tryApplySelection(); 
      });
    });
  }

   private tryApplySelection() {
    if (!this.items?.length) return;
    if (this._selectedKey == null) { this.selected = null; return; }
    const pk = this.primaryKey;
    const match = this.items.find(i => String(i[pk]) === String(this._selectedKey)) ?? null;
    this.selected = match;
    this.dir.markForCheck();

  }

  getDisplayText(item: T): string {
    return  item[this.displayItemKey];
  }


  openSearchDialog() {

    // const dialogRef = this.dialog.open(SearchDialogComponent,
    //   {
    //     maxWidth: "80vw",
    //     width: '50vw',
    //     data: {
    //       columns: this.columns,
    //       dataFactory: this.dataFactory,
    //       apiEndpoint : this.apiPath, 
    //       tableName : this.tableName ,
    //       label: this.dialogLabel
    //     }
    //   }

    // );
    // dialogRef.afterClosed().subscribe(result => {

    // });
  }

}
