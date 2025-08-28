import {
  Component, Input, EventEmitter, Output, OnInit, OnChanges, SimpleChanges
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
  @Input() customUpatedPath?: string;
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

  private mobileColumn?: TableColumn;


  constructor(private genericServiceFactory: GenericServiceFactory, private dialog: MatDialog) { }

  ngOnInit() {
    this.initialRowJson = JSON.stringify(this.selectedRow ?? {});
    this.service = this.genericServiceFactory.create<T>(this.apiPath, this.primaryKey , this.customSearchPath , this.customUpatedPath );
    this.mobileColumn = this.findMobileColumn();
    this.syncLocalFromRow();  
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedRow'] && !changes['selectedRow'].firstChange) {
      this.resetBaseline();
      this.mobileColumn = this.findMobileColumn(); 
      this.syncLocalFromRow();  
    }
  }

  public resetBaseline() {
    this.isDirty = false;
    this.changedFields.clear();
    this.initialRowJson = JSON.stringify(this.selectedRow ?? {});
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
    if (this.showErrors) this.showErrors = false;
  }
  toggleFlag(field: string) {
    if (!this.selectedRow) return;
    const current = Number((this.selectedRow as any)[field]) === 1 ? 1 : 0;
    console.log('Current flag value:', current);
    const next = current === 1 ? 0 : 1;
<<<<<<< HEAD
    console.log('Next flag value:', next);
=======
    console.log('toggleFlag', field, current, '->', next);
>>>>>>> b798679 (last edit)
    this.setField(field, next);
    this.markChanged(field);
    this.rowChanged.emit({ field, value: next });
  }

  onComboSelected(column: TableColumn, item: Record<string, any> | null) {
    if (!this.selectedRow) return;

    if (column.isCombobox && column.primaryKey) {
      const fk = item ? item[column.primaryKey] : null;

      if (column.fieldFK) {
        this.setField(column.fieldFK, fk);
        this.markChanged(column.fieldFK);
        this.rowChanged.emit({ field: column.fieldFK, value: fk });
      } else {
        this.setField(column.field, fk);
        this.markChanged(column.field);
        this.rowChanged.emit({ field: column.field, value: fk });
      }

      if (column.displayItemKey) {
        const displayVal = item ? item[column.displayItemKey] : null;
        this.setField(column.field, displayVal);
        this.markChanged(column.field);
        this.rowChanged.emit({ field: column.field, value: displayVal });
      }
    }

    if (this.showErrors) this.showErrors = false;
  }

  // ========== Utils ==========

  private markChanged(field: string) {
    this.isDirty = true;
    this.changedFields.add(field);
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

  // Build yyyy-MM-ddTHH:mm for <input type="datetime-local">
  toLocalInput(value: any | null): string {
    if (!value) return '';
    const d = new Date(value);            // works with ISO like ...+03:00 or ...Z
    if (isNaN(d.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    const y = d.getFullYear();
    const m = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
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
    // If you prefer UTC 'Z', use: const iso = localStr ? new Date(localStr).toISOString() : null;
    const iso = this.toIsoWithOffset(localStr);
    this.onFieldChanged(column, iso);
  }

  /** Optional: used by (blur) if you kept it in the template */
  touched = false;
  markTouched() { this.touched = true; }




  // ========== Actions ==========


  save = () => {
    if (!this.selectedRow) return;

    const invalid = this.columns.filter(c => this.isMissingRequired(c));
    if (invalid.length) {
      this.showErrors = true;
      return;
    }
  console.log('Saving row:', JSON.stringify(this.selectedRow));
    this.service.save(this.selectedRow).subscribe({
      next: (res) => {
        this.selectedRow = res;
        this.resetBaseline();
        this.rowSaved.emit(res);
      }
    });
  };




  public addNewRow = () => {
    const row: Row = this.dataFactory ? this.dataFactory() : {};

    for (const c of this.columns) {
      if (!(c.field in row)) {
        if (c.isFlag) row[c.field] = 0;
        else if (c.dataType === 'number') row[c.field] = null;
        else row[c.field] = null;
      }
      if (c.isCombobox && c.fieldFK && !(c.fieldFK in row)) {
        row[c.fieldFK] = null;
      }
    }

    if (this.selectedId && this.searchParameterKey) {
      row[this.searchParameterKey] = this.selectedId;
    }

    this.selectedRow = row as T;
    this.resetBaseline();
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
      this.service.delete(this.selectedRow).subscribe({
        next: () => {
          this.rowDeleted.emit({ type: 'persisted', id });
          this.clearRow();
        },
        error: (err) => console.error('Delete failed', err)
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

  private findMobileColumn(): TableColumn | undefined {
  return this.columns.find(c => c.dataType === 'mobile');
}



localMobile = '';  // 9 digits max

private syncLocalFromRow(): void {
  if (!this.selectedRow || !this.mobileColumn) {
    this.localMobile = '';
    return;
  }
  const full = (this.selectedRow as any)[this.mobileColumn.field] as string | null | undefined;

  if (typeof full === 'string' && full.startsWith('+974') && full.length >= 5) {
    this.localMobile = full.substring(4).slice(0, 8); 
  } else {
    this.localMobile = '';
  }
}

onLocalChanged(value: string, column: TableColumn) {
  // إزالة أي رموز غير أرقام + تحويل الأرقام العربية لو موجودة
  const map: Record<string, string> = { 
    '٠': '0','١':'1','٢':'2','٣':'3','٤':'4',
    '٥':'5','٦':'6','٧':'7','٨':'8','٩':'9' 
  };
  value = (value || '').replace(/[٠-٩]/g, d => map[d]).replace(/\D/g, '');

  // قص لأقصى 8 أرقام
  value = value.slice(0, 8);

  // لازم يبدأ بـ 3 أو 5 أو 6 أو 7
  if (value && !/^[3567]/.test(value)) {
    const m = value.match(/[3567]\d{0,7}/); // أول رقم صح + باقي الأرقام
    value = m ? m[0] : '';
  }

  this.localMobile = value;

  // القيمة الكاملة مع +974
  const full = value ? `+974${value}` : null; // null لو فارغ
  this.onFieldChanged(column, full);
}




}
