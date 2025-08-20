import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';


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
  @Input() isEditableTable!: boolean ;

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
}
