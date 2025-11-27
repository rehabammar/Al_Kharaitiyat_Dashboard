import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Optional,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { GenericService } from '../../../../core/services/crud/generic.service';
import { GenericServiceFactory } from '../../../../core/factories/generic-service-factory';
import { ButtonVisibilityConfig } from '../../../../core/models/button-visibility-config.interface';
import { TableColumn } from '../../../../core/models/table-column.interface';
import { ConfirmPopupComponent } from '../../confirm-popup/confirm-popup.component';
import { Totals } from '../../../../core/models/totals.interface';
import { Observable, of } from 'rxjs';
import { finalize, take } from 'rxjs/operators';
import { TranslateService, Translation } from '@ngx-translate/core';
import { WhatsappPreviewPopupComponent } from '../../../../Features/payments/components/whatsapp-preview-popup/whatsapp-preview-popup.component';

@Component({
  selector: 'app-generic-table',
  standalone: false,
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericTableComponent<T extends Record<string, any>> implements AfterViewInit, OnInit {

  @Input() columns: TableColumn[] = [];
  @Input() dataFactory!: () => T;
  @Input() primaryKey!: keyof T;
  @Input() apiPath!: string;
  @Input() customSearchPath?: string;
  @Input() customUpatedPath?: string;
  @Input() customUpatedAllPath?: string;
  @Input() customExportPath?: string;
  @Input() selectedId: string | number | null | undefined = null;
  @Input() searchParameterKey!: string;
  @Output() rowSelected = new EventEmitter<any>();

  @Input() buttonVisibility: ButtonVisibilityConfig = {
    showDelete: true,
    showInsert: true,
    showSave: true,
    showRollback: true,
    showTranslation: true,
  };
  @Input() screenId!: string;
  @Input() isEditableTable: boolean = false;
  @Input() enableSaveAll: boolean = false;
  @Input() showInTableFooter: boolean = false;
  @Input() exportToExcelFl: boolean = false;
  @Input() onToggleSelection?: (row: T, checked: boolean) => void;
  @Input() overridePage?: number;



  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<T>([]);
  displayedColumns: string[] = [];
  totalCount: number = 0;
  totals: Totals = {
    totalAmountPaid: 0,
    totalTeacher: 0,
    totalCenter: 0,
    totalAmount: 0,
    totalAmountRemaining: 0
  };
  selectedRow: T | null = null;
  showFilter: boolean = false;
  isSaveAttempted: boolean = false;
  parameter: Record<string, any> = {};
  service!: GenericService<T>;
  serviceTL!: GenericService<T>;

  isHovered: string | null = null;

  filters: Record<string, any> = {};
  sort: Array<{ property: string; direction: 'asc' | 'desc' }> = [];
  activeSort: { field: string; direction: 'asc' | 'desc' } | null = null;

  lastSelectedId?: number;
  lastPageIndex: number = 0;

  privileges: any;

  /** علامة أنّ الصف الحالي به تعديلات غير محفوظة */
  private rowDirty = false;

  buttonDisabled: { [key: string]: boolean } = {
    insert: false,
    update: false,
    updateAll: false,
    delete: false,
    save: false,
    rollback: true,
    translation: true,
    print: true,
    excel: true
  };

  private inited = false;

  selectedRows: T[] = [];

  isBusy: boolean = false;
  originalButtonDisabled: { [key: string]: boolean } = {};

  isSearchMode: boolean = false;


  constructor(
    private dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef,
    private genericServiceFactory: GenericServiceFactory,
    private translationService: TranslateService,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any,
  ) {
    if (this.dialogData) {
      this.primaryKey = this.dialogData.primaryKey;
      this.dataFactory = this.dialogData.dataFactory;
      this.apiPath = this.dialogData.apiPath;
      this.columns = this.dialogData.columnsTL ?? this.dialogData.columns;
      this.selectedId = this.dialogData.selectedId;
      this.buttonVisibility = this.dialogData.buttonVisibility ?? this.buttonVisibility;
      this.parameter = { id: this.selectedId };
    }
  }

  private ensureService() {
    if (!this.service) {
      this.service = this.genericServiceFactory.create<T>(
        this.apiPath, this.primaryKey, this.customSearchPath, this.customUpatedPath, this.customUpatedAllPath, this.customExportPath
      );
    }
  }

  ngOnInit(): void {
    this.checkPrivileges();
    this.ensureService();
    this.columns = this.columns.filter(c => (c.showInTable ?? true));
    this.displayedColumns = this.columns.map(col => col.field);
    this.setDefaultSortDescByPk();

    // subscribe ONCE (avoid re-subscribing inside loadData)
    this.service.data$.subscribe((rows: T[]) => {

      rows = rows.map(row => ({
        ...row,
        selected: row['selected'] ?? false
      }));

      this.dataSource.data = rows;
      if (!this.selectedRow && rows.length > 0) {
        this.selectedRow = rows[0];
      } else {
        this.selectedRow = undefined as any;
      }
      this.rowSelected.emit(this.selectedRow);
      this.changeDetectorRef.markForCheck();
    });

    this.service.totalElements$.subscribe((count: number) => {
      this.totalCount = count;
      this.changeDetectorRef.markForCheck();
    });
    this.service.totals$.subscribe((totals: Totals) => {
      this.totals = totals;
      this.changeDetectorRef.markForCheck();
    });
    this.inited = true;
    this.originalButtonDisabled = { ...this.buttonDisabled };

  }

  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => this.loadData());
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['apiPath'] || changes['customSearchPath'] || changes['primaryKey']) {
      this.ensureService();
    }

    if (changes['selectedId']) {
      this.parameter = this.selectedId != null && this.searchParameterKey
        ? { [this.searchParameterKey]: this.selectedId }
        : {};
      this.selectedRow = undefined as any;

      if (this.inited && this.service) this.loadData();
    }
  }

  trackByPrimaryKey = (_: number, row: any) => row?.[this.primaryKey];

  loadData(): void {
    const pageIndex = this.paginator?.pageIndex ?? 0;
    // const pageSize = this.paginator?.pageSize ?? 10;

    const pageSize = this.isSearchMode
      ? (this.overridePage ?? 5)
      : this.paginator?.pageSize ?? 5;


    const body = this.buildRequest(pageIndex, pageSize);
    this.service.getAll(pageIndex, pageSize, undefined, body).subscribe();
  }

  private setDefaultSortDescByPk() {
    if (!this.sort.length && this.primaryKey) {
      const pk = this.primaryKey as string;
      this.sort = [{ property: pk, direction: 'desc' }];
      this.activeSort = { field: pk, direction: 'desc' };
    }
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

  private buildRequest(page: number, size: number) {
    return {
      page,
      size,
      ...this.parameter,
      ...this.filters,
      ...(this.sort.length ? { sort: this.sort } : {})
    };
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
      this.sort = [{ property: field, direction }];
    } else {
      this.isSearchMode = true;

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

      if (Object.keys(this.filters).length > 0) {
        this.isSearchMode = true;  
      } else {
        this.isSearchMode = false;  
      }
    }
    this.loadData();
  }

  clearAllFilters = () => {
    this.isSearchMode = false;
    this.filters = {};
    this.sort = [];
    this.activeSort = null;
    this.paginator?.firstPage();
    this.setDefaultSortDescByPk();
    this.loadData();
  }

  /** تحديد صف */
  selectRow(row: T): void {
    this.selectedRow = row;
    this.rowSelected.emit(row);
    this.rowDirty = false;
    if (this.selectedRow[this.primaryKey]) {
      this.checkPrivileges();
    } else {
      this.updatePrivileges();
    }
  }

  /** تحديث قيمة في الصف الحالي + تعليم أنه متسخ */
  onFieldChanged(row: T, change: { field: string; value: any }): void {
    row[change.field as keyof T] = change.value;
    this.rowDirty = true;
  }

  // ==================== منطق التأكيد قبل إضافة صف جديد ====================

  /** هل يوجد صف جديد غير محفوظ أو تعديلات لم تُحفظ؟ */
  private hasUncommitted(): boolean {
    const row = this.selectedRow;
    if (!row) return false;

    const pk = this.primaryKey as string;
    const noPk = row[pk] == null;                 // لم يُحفظ بعد
    const hasCid = (row as any)?.['__cid'] != null; // مسودة محلية
    return noPk || hasCid || this.rowDirty;
  }

  /** إنشاء صف جديد داخليًا دون فحص */
  private createNewRowInternal() {
    const newRow = this.dataFactory();
    this.rowSelected.emit(newRow);
    this.dataSource.data = [newRow, ...this.dataSource.data];
    this.selectedRow = newRow;
    this.rowDirty = false;
    this.updatePrivileges();
    this.changeDetectorRef.markForCheck();
  }

  /** حذف المسودة/الصف غير المحفوظ (إن وجد) */
  private discardCurrentDraftIfAny() {
    const row = this.selectedRow;
    if (!row) return;
    const pk = this.primaryKey as string;

    if (row[pk] == null) {
      const idx = this.dataSource.data.indexOf(row);
      if (idx !== -1) {
        const copy = [...this.dataSource.data];
        copy.splice(idx, 1);
        this.dataSource.data = copy;
      }
      this.selectedRow = null;
      this.rowDirty = false;
      this.changeDetectorRef.markForCheck();
    }
  }

  /** واجهة حفظ ترجع Observable لتسهيل السلاسل */
  private save$(): Observable<T> {
    if (!this.selectedRow) return of(null as any);

    this.isSaveAttempted = true;

    // التحقق من الحقول المطلوبة
    const invalidFields = this.columns.filter(col => col.required && !this.selectedRow![col.field]);
    if (invalidFields.length > 0) {
      console.warn('Validation Errors:', invalidFields);
      return of(null as any);
    }

    // ربط FK للأب (إن وجد)
    if (this.searchParameterKey && this.selectedId) {
      (this.selectedRow as Record<string, any>)[this.searchParameterKey] = this.selectedId;
    }

    this.setBusy(true);
    return this.service.save(this.selectedRow).pipe(
      take(1),
      finalize(() => {
        this.setBusy(false);
        this.isSaveAttempted = false;
        this.changeDetectorRef.markForCheck();
      })
    );
  }

  /** حفظ (زر حفظ) */
  save = () => {
    this.save$().subscribe(updatedRow => {
      if (!updatedRow) return;
      this.rowDirty = false;
      this.selectRow(updatedRow);
      this.checkPrivileges();
    });
  };

  /** حفظ ثم إنشاء صف جديد */
  private saveAndThenCreate() {
    if (!this.selectedRow) return;
    this.save$().subscribe(updatedRow => {
      if (!updatedRow) return;     // فشل تحقق أو حفظ
      this.rowDirty = false;
      this.selectRow(updatedRow);
      this.createNewRowInternal();
    });
  }

  /** إضافة صف جديد مع تأكيد لو في تعديلات/مسودة */
  addNewRow = () => {
    if (!this.hasUncommitted()) {
      this.createNewRowInternal();
      return;
    }

    this.dialog.open(ConfirmPopupComponent, {
      data: {
        type: 'warning',
        titleKey: 'label.warning',
        messageKey: 'message.unsavedChanges',
        okLabel: 'commit',                 // يحفظ أولًا
        cancelLabel: 'label.cancel',             // إلغاء
        extraButtons: [{ id: 'discard', labelKey: 'label.discard' }], // تجاهل
        showCancel: true
      },
      panelClass: 'dialog-warning',
      disableClose: true
    }).afterClosed().pipe(take(1)).subscribe(res => {
      // نتوقع { result: 1 | 0 | 'discard' }
      if (!res) return;

      if (res.result === 1) {
        // حفظ ثم إنشاء
        this.saveAndThenCreate();
      } else if (res.result === 'discard') {
        // تجاهل → احذف المسودة ثم أنشئ
        this.discardCurrentDraftIfAny();
        this.createNewRowInternal();
      } else {
        // إلغاء
        return;
      }
    });
  };


  saveAll = () => {
    const selected = this.selectedRows ?? [];
    if (selected.length === 0) return;

    this.setBusy(true);

    this.service.saveAll(selected).pipe(
      finalize(() => {
        this.setBusy(false);
        this.changeDetectorRef.markForCheck();
      })
    )
      .subscribe({
        next: () => {
          this.selectedRows = [];
          this.loadData();
        },
      });
  };




  // ==================== نهاية منطق التأكيد ====================

  openDeletePopup = () => {
    this.dialog.open(ConfirmPopupComponent, {
      data: {
        type: 'confirm',
        messageKey: 'message.areYouSure',
        showCancel: true
      },
      panelClass: 'dialog-warning',
      disableClose: true
    }).afterClosed().subscribe(res => {
      if (res?.result === 1) {
        this.delete();
      }
    });
  }

  openTranslationTable = () => {
    const data = {
      dataFactory: this.dataFactory,
      apiPath: this.apiPath,
      selectedId: this.selectedRow ? this.selectedRow[this.primaryKey] : null,
      buttonVisibility: {
        showDelete: false,
        showInsert: false,
        showSave: true,
        showRollback: false,
        showTranslation: false
      }
    };

    this.dialog.open(GenericTableComponent, {
      width: '80vw',
      maxWidth: '80vw',
      panelClass: 'high-z-dialog',
      backdropClass: 'fullscreen-backdrop',
      hasBackdrop: true,
      autoFocus: false,
      data
    });
  };


  delete = () => {
    this.setBusy(true);

    if (this.selectedRow && this.selectedRow[this.primaryKey]) {

      this.service.delete(this.selectedRow).pipe(
        finalize(() => {
          this.setBusy(false);
          this.changeDetectorRef.markForCheck();
        })
      ).subscribe({
        next: () => {
          this.loadData();
        },

      });

    } else {
      const index = this.dataSource.data.indexOf(this.selectedRow!);
      if (index !== -1) {
        this.dataSource.data.splice(index, 1);
        this.dataSource._updateChangeSubscription();
      }

      this.selectedRow = null;
      this.rowDirty = false;
      this.checkPrivileges();

      this.setBusy(false);
      this.changeDetectorRef.markForCheck();
    }
  };


  print = () => { }

  tooggleShowFilter = () => {
    this.showFilter = !this.showFilter;
  }

  rollback = () => {
    this.lastPageIndex = this.paginator?.pageIndex || 0;
    this.lastSelectedId = this.selectedRow ? this.selectedRow[this.primaryKey] : undefined;
    this.loadDataWithRestore();
  }


  exportToExcel = () => {
    const excelColumns = this.columns.map(col => ({
      fieldName: col.field,
      labelValue: this.translationService.instant(col.labelKey)
    }));

    const requestBody = {
      ...this.parameter,
      ...this.filters,
      sort: [
        {
          property: this.activeSort?.field || "userPk",
          direction: this.activeSort?.direction || "desc"
        }
      ],
      export: {
        Type: "excel",
        columns: excelColumns
      }
    };

    this.service.exportToExcel(requestBody);
  };



  loadDataWithRestore(filters?: any): void {
    this.paginator.pageIndex = this.lastPageIndex;
    this.loadData();

    this.service.data$.subscribe((data: T[]) => {
      if (this.lastSelectedId) {
        const found = data.find(row => row[this.primaryKey] === this.lastSelectedId);
        if (found) {
          this.selectedRow = found;
        } else if (data.length > 0) {
          this.selectedRow = data[0];
        }
      }
      this.changeDetectorRef.markForCheck();
    });
  }

  get headerClass(): string {
    return this.showFilter ? 'header-container with-filter' : 'header-container no-filter';
  }

  checkPrivileges() {
    // privileges logic (اختياري)
  }

  updatePrivileges() {
    this.buttonDisabled['save'] = false;
    this.buttonDisabled['delete'] = false;
  }

  public patchRowById(id: any, changes: Partial<T>) {
    const pk = this.primaryKey as string;
    const arr = this.dataSource.data;
    const idx = arr.findIndex(r => r[pk] === id);

    if (idx !== -1) {
      const updated = { ...arr[idx], ...changes } as T;
      this.dataSource.data = [
        ...arr.slice(0, idx),
        updated,
        ...arr.slice(idx + 1),
      ];

      if (this.selectedRow && this.selectedRow[pk] === id) {
        this.selectedRow = updated;
        this.rowSelected.emit(updated);
      }
      this.changeDetectorRef.markForCheck();
    }
  }

  public prependRow(row: T) {
    this.dataSource.data = [row, ...this.dataSource.data];
    this.selectedRow = row;
    this.rowSelected.emit(row);
    this.changeDetectorRef.markForCheck();
  }

  public removeRow(rowOrId: any) {
    const pk = this.primaryKey as string;
    const data = this.dataSource.data;

    const idx = typeof rowOrId === 'object'
      ? data.indexOf(rowOrId)
      : data.findIndex(r => r[pk] === rowOrId);

    if (idx === -1) { this.loadDataWithRestore(); return; }

    const newData = [...data.slice(0, idx), ...data.slice(idx + 1)];
    this.dataSource.data = newData;

    const next = newData[idx] ?? newData[idx - 1] ?? null;
    this.selectedRow = next as any;
    this.rowSelected.emit(this.selectedRow);
    this.changeDetectorRef.markForCheck();
  }

  replaceRowByCid(cid: string, serverRow: any) {
    const withoutDraft = this.dataSource.data.filter(r => r['__cid'] !== cid);
    const pkField = this.primaryKey as string;
    const idx = withoutDraft.findIndex(r => String(r[pkField]) === String(serverRow[pkField]));
    this.dataSource.data = idx === -1
      ? [serverRow, ...withoutDraft]
      : [...withoutDraft.slice(0, idx), serverRow, ...withoutDraft.slice(idx + 1)];
    this.changeDetectorRef.markForCheck?.();
  }

  upsertByPk(pkField: string, newRow: any) {
    const arr = this.dataSource.data.filter(r => r[pkField] != null);
    const idx = arr.findIndex(r => String(r[pkField]) === String(newRow[pkField]));
    this.dataSource.data = idx === -1
      ? [newRow, ...arr]
      : [...arr.slice(0, idx), newRow, ...arr.slice(idx + 1)];
    this.changeDetectorRef.markForCheck?.();
  }

  selectRowById(id: any) {
    const pk = this.primaryKey as string;
    const found = this.dataSource.data.find(r => String(r[pk]) === String(id));
    if (found) {
      this.selectedRow = found;
      this.rowSelected.emit(found);
      this.changeDetectorRef.markForCheck?.();
    }
  }



  toggleSelection(row: T, checked: boolean) {
    const r = row as AnyRow;
    r['selected'] = checked;

    // إدارة قائمة الصفوف المختارة
    if (checked) {
      if (!this.selectedRows.includes(row)) {
        this.selectedRows.push(row);
      }
    } else {
      this.selectedRows = this.selectedRows.filter(rr => rr !== row);
    }

    // تنفيذ callback اللي جاية من الشاشة الرئيسية
    if (this.onToggleSelection) {
      this.onToggleSelection(row, checked);
    }

    this.rowDirty = true;
    this.changeDetectorRef.markForCheck();
  }

  setBusy(state: boolean) {
    this.isBusy = state;

    if (state) {
      Object.keys(this.buttonDisabled).forEach(key => {
        this.buttonDisabled[key] = true;
      });
    } else {
      this.buttonDisabled = { ...this.originalButtonDisabled };
    }

    this.changeDetectorRef.markForCheck();
  }



  selectAllRows = () => {
    const data = this.dataSource.data;

    // امسح القديم
    this.selectedRows = [];

    data.forEach(row => {
      if (!row['selected']) {
        this.toggleSelection(row, true);
      }
    });

    this.rowDirty = true;
    this.changeDetectorRef.markForCheck();
  };


  unselectAllRows = () => {
    const data = this.dataSource.data;

    data.forEach(row => {
      if (row['selected']) {
        this.toggleSelection(row, false);
      }
    });

    this.selectedRows = [];
    this.rowDirty = true;
    this.changeDetectorRef.markForCheck();
  };


openWhatsappPopup = ( type : string ) => {
  if (this.selectedRows.length === 0) return;

  this.dialog.open(WhatsappPreviewPopupComponent, {
    width: '500px',
    data: {
      rows: this.selectedRows,
      type: type
    }
  });
};


confirmSaveAllForPyments = () => {
    if (!this.selectAllRows) return;
    this.dialog.open(ConfirmPopupComponent, {
      data: {
        type: 'confirmation',
        messageKey: 'message.confirmPayment',
        showCancel: true
      }
    }).afterClosed().subscribe(res => {
      if (res?.result === 1) this.saveAll();
    });
  };




}

type AnyRow = { [key: string]: any };
