import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SearchServiceFactory } from '../../../core/factories/search-service-factory';
import { SearchService } from '../../../core/services/shared/search.service';

@Component({
  selector: 'app-combobox-search',
  standalone: false,
  templateUrl: './combobox-search.component.html',
  styleUrl: './combobox-search.component.css' ,
})
export class ComboboxSearchComponent<T extends Record<string, any> > implements OnInit {
  [x: string]: any;

  @Output() itemSelected = new EventEmitter<T | null>();
  @Input() apiPath!: string;
  @Input() dataFactory!: () => T;
  @Input() primaryKey!: keyof T;
  @Input() displayItemKey!: keyof T;
  @Input() set selectedKey(val: any) {
    this._selectedKey = val;
    this.tryApplySelection(); 
  } 
  @Input() dialogLabel : string = ""
  @Input() hasError = false;

  currentPage = 0;
  pageSize = 10;

  items: T[] = []

  searchService!: SearchService<T>;
  private _selectedKey: any = null;

  constructor(private searchFactory: SearchServiceFactory, private dialog: MatDialog) { }

    readonly MORE_OPTION = '__MORE_OPTION__' as const;


  ngOnInit(): void {
    this.searchService = this.searchFactory.create<T>(this.apiPath);
    this.loadData();
  }


  selected: T | null | typeof this.MORE_OPTION = null;

onSelect(value: T | null | typeof this.MORE_OPTION) {
  if (value === this.MORE_OPTION) {
    this.openSearchDialog();
    this.selected = null;
    return;
  }
  this.itemSelected.emit(value); // ✅ correct type
}

  loadData(): void {
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
