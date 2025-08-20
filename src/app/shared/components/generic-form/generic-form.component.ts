import {
  Component, Input, EventEmitter, Output, OnInit, OnChanges, SimpleChanges
} from '@angular/core';
import { TableColumn } from '../../../core/models/table-column.interface';
import { GenericServiceFactory } from '../../../core/factories/generic-service-factory';
import { GenericService } from '../../../core/services/crud/generic.service';
import { ConfirmPopupComponent } from '../confirm-popup/confirm-popup.component';
import { MatDialog } from '@angular/material/dialog';

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

  @Output() rowChanged = new EventEmitter<{ field: string; value: any }>();
  @Output() newRowCreated = new EventEmitter<T>();
  @Output() rowDeleted = new EventEmitter<any>();
  @Output() rowSaved      = new EventEmitter<T>();                          



  isDirty = false;
  changedFields = new Set<string>();
  initialRowJson = '';

  service!: GenericService<T>;

  constructor(private genericServiceFactory: GenericServiceFactory, private dialog: MatDialog) { }

  ngOnInit() {
    this.initialRowJson = JSON.stringify(this.selectedRow ?? {});
    this.service = this.genericServiceFactory.create<T>(this.apiPath, this.primaryKey);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedRow'] && !changes['selectedRow'].firstChange) {
      this.resetBaseline();
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
    const v = this.getFieldValue(column);
    if (column.isFlag) return !(v === 1 || v === true);
    if (column.dataType === 'number')
      return v === null || v === undefined || v === '';
    return v === null || v === undefined || String(v).trim() === '';
  }
  isInvalid(column: TableColumn): boolean {
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
    const next = current === 1 ? 0 : 1;
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

  // ========== Actions ==========


  save = () => {
    if (!this.selectedRow) return;

    const invalid = this.columns.filter(c => this.isMissingRequired(c));
    if (invalid.length) {
      this.showErrors = true;
      return;
    }

    this.service.save(this.selectedRow).subscribe({
      next: (res) => {
        this.resetBaseline();
        this.rowSaved.emit(res.data); 
      }
    });
  };




  public addNewRow = () => {
    const row: Row = this.dataFactory ? this.dataFactory() : {};

    // ضمّن الحقول بديفولتات من تعريف الأعمدة
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
}
