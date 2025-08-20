// import { Component, Inject, ViewEncapsulation } from '@angular/core';
// import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
// import { TableColumn } from '../../../models/table-column.interface';
// import { ButtonVisibilityConfig } from '../../../models/button-visibility-config.interface';
// import { MatExpansionModule } from '@angular/material/expansion';
// import { TranslateModule } from '@ngx-translate/core';
// import { CommonModule } from '@angular/common';
// import { GenericTableComponent } from '../generic-table/generic-table.component';

// @Component({
//   selector: 'app-translation-table',
//   standalone: true,
//   templateUrl: './translation-table.component.html',
//   styleUrl: './translation-table.component.css',
//   encapsulation: ViewEncapsulation.None,
//   imports: [
//     CommonModule,
//     MatDialogModule,
//     MatExpansionModule,
//     TranslateModule,
//     GenericTableComponent 
//   ]
// })
// export class TranslationTableComponent {

//   translationColumn: TableColumn[] = [];
//   selectedId: number | null = null;
//   entityName!: string;
//   dataFactory!: any;
//   primaryKey!: any;

//   buttonVisibility: ButtonVisibilityConfig = {
//     showDelete: false,
//     showInsert: false,
//     showSave: true,
//     showRollback: false,
//     showTranslation: false,
//   }

//   constructor(
//     @Inject(MAT_DIALOG_DATA) public data: any,
//     public dialogRef: MatDialogRef<TranslationTableComponent> 
//   ) {
//     console.log('Received primaryKey:', data.primaryKey);
//     console.log('Received dataFactory:', data.dataFactory);
//     console.log('Received translationColumn:', data.columnsTL);
//     console.log('Received selectedId:', data.selectedId);
//     console.log('Received entityName:', data.entityName);

//     this.primaryKey = data.primaryKey;
//     this.dataFactory = data.dataFactory;
//     this.translationColumn = data.columnsTL;
//     this.selectedId = data.selectedId;
//     this.entityName = data.entityName;
//   }

//   popupAction(clickResult: number) {
//     this.dialogRef.close({ result: clickResult });
//   }

// }
