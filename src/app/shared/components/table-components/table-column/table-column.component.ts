import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TableColumn } from '../../../../core/models/table-column.interface';


@Component({
  standalone: false,
  selector: 'app-table-column',
  templateUrl: './table-column.component.html',
  styleUrls: ['./table-column.component.css'],
})
export class TableColumnComponent {
  @Input() column: any;
  @Input() selectedRow: any;
  @Input() currentRow: any;
  @Input() isSaveAttempted: boolean = false;
  @Input() isEditableTable!: boolean;
  @Input() primaryKey!: any;

  @Output() fieldChanged = new EventEmitter<{ field: string, value: any }>();

  toggleStatus(): void {
    if (this.column && this.currentRow) {
      const field = this.column.field;
      const newValue = this.currentRow[field] === 1 ? 0 : 1;
      this.fieldChanged.emit({ field, value: newValue });
    }
  }

  getColumnData(): any {
    if (this.column && this.currentRow) {
      const field = this.column.field;
      return this.currentRow[field] !== undefined ? this.currentRow[field] : null;
    }
    return null;
  }

  updateColumnData(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      const value = inputElement.value;
      const field = this.column.field;
      this.fieldChanged.emit({ field, value });
    }
  }

  isFieldInvalid(): boolean {
    return this.isSaveAttempted && this.column.required && !this.currentRow[this.column.field];
  }

  onComboSelected(column: TableColumn, item: Record<string, any> | null) {
    if (!this.selectedRow) return;

    if (column.isCombobox && column.primaryKey) {
      const fk = item ? item[column.primaryKey] : null;

      if (column.fieldFK) {
        this.currentRow[column.fieldFK] = fk
      }

      if (column.displayItemKey) {
        const displayVal = item ? item[column.displayItemKey] : null;
        const field = this.column.field;
        this.currentRow[column.field] = displayVal
        this.fieldChanged.emit({ field, value: displayVal });

      }
    }

  }

  updateCurrentRowAfterSelection() {
    if (!this.column?.onSearch) return;

    const result = this.column.onSearch(this.currentRow); // may be Observable/Promise/value

    const apply = (picked: any) => {
      if (!picked) return;
      this.currentRow = picked; // replace the entire row

      // Optionally notify parent about all fields
      Object.keys(picked).forEach(field => {
        this.fieldChanged.emit({ field, value: picked[field] });
      });
    };

    if (result && typeof (result as any).subscribe === 'function') {
      (result as any).subscribe((row: any) => apply(row));
    } else if (result && typeof (result as any).then === 'function') {
      (result as Promise<any>).then(row => apply(row));
    } else {
      apply(result);
    }
  }

  // 0..4 index array for the stars
  five = Array.from({ length: 5 });

  // Clamp to 0..5 and floor to int
  safeIntRating(row: any, field: string): number {
    const raw = Number(row?.[field]);
    if (Number.isNaN(raw)) { return 0; }
    return Math.max(0, Math.min(5, Math.floor(raw)));
  }


}
