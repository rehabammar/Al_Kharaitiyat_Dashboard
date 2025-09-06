import {
  Component, Input, EventEmitter, Output, OnInit, OnChanges, SimpleChanges,
  ChangeDetectorRef
} from '@angular/core';
import { TableColumn } from '../../../core/models/table-column.interface';
import { GenericServiceFactory } from '../../../core/factories/generic-service-factory';
import { GenericService } from '../../../core/services/crud/generic.service';
import { ConfirmPopupComponent } from '../confirm-popup/confirm-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { ButtonVisibilityConfig } from '../../../core/models/button-visibility-config.interface';

type Row = Record<string, any>;

@Component({
  selector: 'app-generic-form',
  templateUrl: './generic-form.component.html',
  styleUrls: ['./generic-form.component.css'],
  standalone: false,
})
export class GenericFormComponent<T extends Record<string, any>>
  implements OnInit, OnChanges {

  @Input() columns: TableColumn[] = [];

  @Input() selectedRow: T | null = null;

  @Input() alwaysEditable = false;
  @Input() editable = true;
  @Input() dataFactory!: () => T;
  @Input() primaryKey!: Extract<keyof T, string>;
  @Input() apiPath!: string;
  @Input() customSearchPath?: string;
  @Input() set customUpdatedPath(value: string | undefined) {
    if (value && value !== this._customUpdatedPath) {
      this._customUpdatedPath = value;
      this.rebuildService();
      this.cdr.markForCheck();
    }
  }
  @Input() selectedId: string | number | null | undefined = null;
  @Input() searchParameterKey!: string;

  @Input() commitLabel!: string;


  @Output() rowChanged = new EventEmitter<{ field: string; value: any }>();
  @Output() newRowCreated = new EventEmitter<T>();
  @Output() rowDeleted = new EventEmitter<any>();
  @Output() rowSaved = new EventEmitter<T>();


  @Input() context?: string;

  @Input() buttonVisibility: ButtonVisibilityConfig = {
    showDelete: true,
    showInsert: true,
    showSave: true,
    showRollback: true,
    showTranslation: true,
  };


  isDirty = false;
  changedFields = new Set<string>();
  initialRowJson = '';

  service!: GenericService<T>;

  isLoading = false;

  private mobileColumn?: TableColumn;


  get customUpdatedPath(): string | undefined {
    return this._customUpdatedPath;
  }
  private _customUpdatedPath?: string;

  constructor(
    private genericServiceFactory: GenericServiceFactory,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef ) { }

  ngOnInit() {
    this.initialRowJson = JSON.stringify(this.selectedRow ?? {});
    this.rebuildService();
    this.mobileColumns = this.findMobileColumns();
    this.syncLocalFromRow();
    this.buildDependentsIndex();

  }

  ngOnChanges(changes: SimpleChanges): void {
    // لو الصف اتغير
    if (changes['selectedRow'] && !changes['selectedRow'].firstChange) {
      this.resetBaseline();
      this.mobileColumns = this.findMobileColumns();
      this.syncLocalFromRow();
    }

    // لو المسارات أو الأساسيات اتغيرت (أعد تهيئة الخدمة)
    if (
      (changes['apiPath'] && !changes['apiPath'].firstChange) ||
      (changes['customSearchPath'] && !changes['customSearchPath'].firstChange) ||
      (changes['primaryKey'] && !changes['primaryKey'].firstChange)
    ) {
      this.rebuildService();
      this.buildDependentsIndex();
      this.cdr.markForCheck();
    }
  }

  private rebuildService() {
    this.service = this.genericServiceFactory.create<T>(
      this.apiPath,
      this.primaryKey,
      this.customSearchPath,
      this._customUpdatedPath
    );
  }

  public resetBaseline() {
    this.isDirty = false;
    this.changedFields.clear();
    this.initialRowJson = JSON.stringify(this.selectedRow ?? {});
    this.cdr.markForCheck();
  }

  private setField(key: string, value: any) {
    if (!this.selectedRow) return;
    (this.selectedRow as unknown as Record<string, any>)[key] = value;
  }


  // ========== check for required fields =========

  showErrors = false;



  private getFieldValue(column: TableColumn): any {
    if (!this.selectedRow) return null;
    const key = column.isCombobox ? (column.fieldFK ?? column.field) : column.field;
    return (this.selectedRow as any)[key];
  }

  private isMissingRequired(column: TableColumn): boolean {
    if (!column.required) return false;
    if (!this.selectedRow) return false;
    const v = this.getFieldValue(column);
    if (column.isFlag) return !(v === 1 || v === true);
    if (column.dataType === 'number')
      return v === null || v === undefined || v === '';
    return v === null || v === undefined || String(v).trim() === '';
  }
  isInvalid(column: TableColumn): boolean {
    const val = (this.selectedRow?.[column.field] ?? '') as string;
    if (column.dataType === 'mobile') {
      // قطر: يبدأ بـ +974 ثم 8 أرقام (أول رقم 3 أو 5 أو 6 أو 7)
      const ok = /^\+974[3567]\d{7}$/.test(val);
      return this.showErrors && (column.required ? !ok : (val ? !ok : false));
    }
    return this.showErrors && this.isMissingRequired(column);
  }


  // ========== Handlers ==========

  onFieldChanged(column: TableColumn, newValue: any) {
    if (!this.selectedRow) return;
    const coerced = this.coerceValueByType(column, newValue);
    this.setField(column.field, coerced);
    this.markChanged(column.field);
    this.rowChanged.emit({ field: column.field, value: coerced });
    const dependents = this.dependentsIndex[column.field] ?? [];
    for (const child of dependents) {
      if (child.fieldFK) this.setField(child.fieldFK, null);
      this.setField(child.field, null);
      if (child.fieldFK) this.markChanged(child.fieldFK);
      this.markChanged(child.field);
    }

    if (this.showErrors) this.showErrors = false;
  }
  toggleFlag(field: string) {
    if (!this.selectedRow) return;
    const current = Number((this.selectedRow as any)[field]) === 1 ? 1 : 0;
    const next = current === 1 ? 0 : 1;
    this.setField(field, next);
    this.markChanged(field);
    this.rowChanged.emit({ field, value: next });
  }

  // onComboSelected(column: TableColumn, item: Record<string, any> | null) {
  //   if (!this.selectedRow) return;

  //   if (column.isCombobox && column.primaryKey) {
  //     const fk = item ? item[column.primaryKey] : null;

  //     if (column.fieldFK) {
  //       this.setField(column.fieldFK, fk);
  //       this.markChanged(column.fieldFK);
  //       this.rowChanged.emit({ field: column.fieldFK, value: fk });
  //     } else {
  //       this.setField(column.field, fk);
  //       this.markChanged(column.field);
  //       this.rowChanged.emit({ field: column.field, value: fk });
  //     }

  //     if (column.displayItemKey) {
  //       const displayVal = item ? item[column.displayItemKey] : null;
  //       this.setField(column.field, displayVal);
  //       this.markChanged(column.field);
  //       this.rowChanged.emit({ field: column.field, value: displayVal });
  //     }
  //   }

  //   if (this.showErrors) this.showErrors = false;
  // }

  onComboSelected(column: TableColumn, item: Record<string, any> | null) {
    if (!this.selectedRow) return;

    // 1) the FK value (id) that should be stored
    const fk = item && column.primaryKey ? (item as any)[column.primaryKey] : null;

    // 2) write the FK to the FK field (or to the field itself if you don't use fieldFK)
    if (column.fieldFK) {
      // route via onFieldChanged so dependents get cleared
      this.onFieldChanged({ ...column, field: column.fieldFK } as TableColumn, fk);
    } else {
      this.onFieldChanged(column, fk);
    }

    // 3) optionally write the display text to the display field
    if (column.displayItemKey) {
      const displayVal = item ? (item as any)[column.displayItemKey] : null;
      // write to the visible/display field
      this.onFieldChanged(column, displayVal);
    }

    if (this.showErrors) this.showErrors = false;
  }

  onPercentChanged(column: TableColumn, value: any) {
    let n = Number(value);
    if (isNaN(n)) n = 0;
    if (n < 0) n = 0;
    if (n > 100) n = 100;
    if (this.selectedRow) {
      (this.selectedRow as any)[column.field] = n;
    }
    this.onFieldChanged(column, n);
  }


  // ========= Compobox handling ==========
  private dependentsIndex: Record<string, TableColumn[]> = {};

  private buildDependentsIndex() {
    this.dependentsIndex = {};
    for (const col of this.columns) {
      for (const parent of col.dependsOn ?? []) {
        (this.dependentsIndex[parent] ??= []).push(col);
      }
    }
  }

  getComboParams(column: TableColumn): Record<string, any> {
    const p: Record<string, any> = {};
    if (!column.paramsMap || !this.selectedRow) return p;
    for (const [apiParam, rowField] of Object.entries(column.paramsMap)) {
      p[apiParam] = (this.selectedRow as any)[rowField] ?? null;
    }
    return p;
  }

  // ========== Utils ==========

  get saveDisabled(): boolean {
    console.log("saveDisabled" )
    return !this.selectedRow || this.isLoading || !this.isDirty;
  }


  private markChanged(field: string) {
    this.isDirty = true;
    console.log("upade isDirty " + this.isDirty);
    this.changedFields.add(field);
    this.cdr.markForCheck();
    this.cdr.detectChanges(); // forces immediate update

  }

  private coerceValueByType(column: TableColumn, value: any) {
    if (column.dataType === 'number') {
      const n = value === '' || value == null ? null : Number(value);
      return Number.isNaN(n as number) ? null : n;
    }
    return value;
  }

  /** يُرجع فقط الحقول المتغيّرة للحفظ */
  buildSavePayload(): Row {
    const payload: Row = {};
    if (!this.selectedRow) return payload;
    for (const f of this.changedFields) {
      payload[f] = (this.selectedRow as any)[f];
    }
    return payload;
  }

  //====== date filed ===========

  /** --- DATE HELPERS --- */

  // Build yyyy-MM-dd أو yyyy-MM-ddTHH:mm حسب النوع
  toLocalInput(value: any | null, type: 'date' | 'datetime' = 'datetime'): string {
    if (!value) return '';
    const d = new Date(value);
    if (isNaN(d.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    const y = d.getFullYear();
    const m = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());

    if (type === 'date') {
      return `${y}-${m}-${dd}`;
    }

    const hh = pad(d.getHours());
    const mm = pad(d.getMinutes());
    return `${y}-${m}-${dd}T${hh}:${mm}`;
  }


  // Convert datetime-local (local time) -> ISO with local offset (+HH:MM)
  private toIsoWithOffset(localStr: string): string | null {
    if (!localStr) return null;
    const d = new Date(localStr);         // interpreted as local time
    if (isNaN(d.getTime())) return null;
    const pad = (n: number) => String(n).padStart(2, '0');
    const y = d.getFullYear();
    const m = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mm = pad(d.getMinutes());
    const ss = pad(d.getSeconds());
    const tz = -d.getTimezoneOffset();    // minutes east of UTC
    const sign = tz >= 0 ? '+' : '-';
    const th = pad(Math.floor(Math.abs(tz) / 60));
    const tm = pad(Math.abs(tz) % 60);
    return `${y}-${m}-${dd}T${hh}:${mm}:${ss}.000${sign}${th}:${tm}`;
  }

  /** Called from (input)/(change) on the date control */
  onDateInput(column: TableColumn, localStr: string) {
    if (!localStr) {
      this.onFieldChanged(column, null);
      return;
    }

    let iso: string | null;

    if (column.dataType === 'date') {
      // نخزن التاريخ فقط بدون وقت
      const d = new Date(localStr);
      if (isNaN(d.getTime())) return;
      const pad = (n: number) => String(n).padStart(2, '0');
      const y = d.getFullYear();
      const m = pad(d.getMonth() + 1);
      const dd = pad(d.getDate());
      iso = `${y}-${m}-${dd}T00:00:00.000Z`;
    } else {
      // datetime
      iso = this.toIsoWithOffset(localStr);
    }

    this.onFieldChanged(column, iso);
  }


  /** Optional: used by (blur) if you kept it in the template */
  touched = false;
  markTouched() { this.touched = true; }

  // ========== Evaluation ==========

  // 5 stars array for *ngFor
  five = [0, 1, 2, 3, 4];

  safeIntRating(v: any): number {
    const n = Number(v);
    if (!Number.isFinite(n)) return 0;
    return Math.min(5, Math.max(0, Math.floor(n)));
  }

  setRating(column: TableColumn, row: any, value: number | null) {
    // allow null (cleared) OR clamp 1..5
    const val = value == null ? null : Math.min(5, Math.max(1, Math.floor(value)));
    row[column.field] = val;
    this.onFieldChanged(column, val);
  }

  // keyboard support: Left/Down -1, Right/Up +1, Home=1, End=5, Delete/Backspace=null
  onRatingKeydown(evt: KeyboardEvent, column: TableColumn, row: any) {
    const cur = row[column.field] == null ? 0 : this.safeIntRating(row[column.field]);
    let next: number | null = cur || 0;

    switch (evt.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        next = Math.max(1, (cur || 1) - 1);
        evt.preventDefault();
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        next = Math.min(5, (cur || 0) + 1);
        evt.preventDefault();
        break;
      case 'Home':
        next = 1; evt.preventDefault(); break;
      case 'End':
        next = 5; evt.preventDefault(); break;
      case 'Delete':
      case 'Backspace':
        next = null; evt.preventDefault(); break;
      default:
        return;
    }
    this.setRating(column, row, next);
  }



  // ========== Actions ==========


  save = () => {
    if (!this.selectedRow) return;

    const invalid = this.columns.filter(c => this.isMissingRequired(c));
    if (invalid.length) { this.showErrors = true; return; }
    this.isLoading = true;

    this.service.save(this.selectedRow).subscribe({
      next: (res: T) => {
        this.selectedRow = res;
        this.resetBaseline();
        this.rowSaved.emit(res);
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
      }
    });
  };



  private _cidSeq = 0;
  private readonly CID = '__cid';
  public addNewRow = () => {
    const pk = this.primaryKey as string;

    // start from factory; clone so we don't mutate a reused instance
    const base = this.dataFactory ? this.dataFactory() : ({} as T);
    const row: any = { ...(base as any) };

    if (row[pk] != null) delete row[pk];
    row[this.CID] = `cid-${Date.now()}-${++this._cidSeq}`;

    // defaults from columns
    for (const c of this.columns) {
      if (!(c.field in row)) row[c.field] = c.isFlag ? 0 : (c.dataType === 'number' ? null : null);
      if (c.isCombobox && c.fieldFK && !(c.fieldFK in row)) row[c.fieldFK] = null;
    }

    // bind parent FK (if you pass selectedId/searchParameterKey)
    if (this.selectedId != null && this.searchParameterKey && row[this.searchParameterKey] == null) {
      row[this.searchParameterKey] = this.selectedId;
    }

    this.selectedRow = row as T;       // draft stays in the form
    this.resetBaseline();

    // Optional: you may still emit the draft for the parent to open panels, etc.
    // BUT don't insert it into a table yet.
    this.newRowCreated.emit(this.selectedRow);
  };



  /** مسح الصف الحالي (يخفي الفورم لو عندك *ngIf="selectedRow") */
  public clearRow = () => {
    this.selectedRow = null;
    this.resetBaseline();
  };

  delete = () => {
    if (!this.selectedRow) return;
    const pk = this.primaryKey;
    const id = this.selectedRow[pk];
    if (this.selectedRow && (this.selectedRow as any)[this.primaryKey] != null) {
      this.isLoading = true;
      this.service.delete(this.selectedRow).subscribe({
        next: () => {
          this.rowDeleted.emit({ type: 'persisted', id });
          this.clearRow();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Delete failed', err);
          this.isLoading = false;
        }
      });
    } else {

      this.rowDeleted.emit({ type: 'new', row: this.selectedRow });
      this.clearRow();
      return;
    }
  };



  openDeletePopup = () => {

    this.dialog.open(ConfirmPopupComponent, {
      // width: '400px',
      data: {
        message: 'message.areYouSure',
        showCancel: true
      }
    }).afterClosed().subscribe(result => {
      if (result?.result === 1) {
        this.delete();
      }
    });

  }

  // =========== mobile validtion ===============

  private findMobileColumns(): TableColumn[] {
    return this.columns.filter(c => c.dataType === 'mobile');
  }


  private mobileColumns: TableColumn[] = [];
  localMobile: Record<string, string> = {};
  private syncLocalFromRow(): void {
    this.localMobile = {};
    if (!this.selectedRow || !this.mobileColumns?.length) return;

    for (const col of this.mobileColumns) {
      const full = (this.selectedRow as any)[col.field] as string | null | undefined;
      if (typeof full === 'string' && full.startsWith('+974') && full.length >= 5) {
        this.localMobile[col.field] = full.substring(4).slice(0, 8); // keep 8 digits
      } else {
        this.localMobile[col.field] = '';
      }
    }
  }


  onLocalChanged(value: string, column: TableColumn) {
    const map: Record<string, string> = {
      '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
      '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
    };

    // normalize digits
    value = (value || '').replace(/[٠-٩]/g, d => map[d]).replace(/\D/g, '');
    // max 8 digits
    value = value.slice(0, 8);
    // must start with 3/5/6/7
    if (value && !/^[3567]/.test(value)) {
      const m = value.match(/[3567]\d{0,7}/);
      value = m ? m[0] : '';
    }

    // update local buffer for THIS field
    this.localMobile[column.field] = value;

    // write full value (+974XXXXXXXX) or null
    const full = value ? `+974${value}` : null;
    this.onFieldChanged(column, full);
  }





}
