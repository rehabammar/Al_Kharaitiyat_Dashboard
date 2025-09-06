import { Component } from '@angular/core';
import { TableColumn } from '../../../core/models/table-column.interface';
import { Lookup } from '../model/lookup.model';
import { LookupDetail } from '../../../core/models/lookup-detail.model';


@Component({
  selector: 'app-system-lookups',
  standalone: false,
  templateUrl: './system-lookups.component.html',
  styleUrl: './system-lookups.component.css'
})
export class SystemLookupsComponent {


lookupDataFactory=  ()=> new Lookup() ;

lookupDetailDataFactory = ()=> new  LookupDetail();

lookupColumns: TableColumn[] = [
  {
    labelKey: 'Lookup.LookupPk',
    field: 'lookupPk',
    dataType: 'number',
    required: false,
    disabled: true,
    width: '110px'
  },
  {
    labelKey: 'Lookup.NameAr',
    field: 'lookupNameAr',
    dataType: 'string',
    required: true,
    width: '240px'
  },
  {
    labelKey: 'Lookup.NameEn',
    field: 'lookupNameEn',
    dataType: 'string',
    required: true,
    width: '240px'
  }
];

lookupDetailColumns: TableColumn[] = [
  {
    labelKey: 'LookupDetail.Id',
    field: 'lookupDetailPk',
    dataType: 'number',
    required: false,
    disabled: true,
    width: '110px'
  },
  {
    labelKey: 'Lookup.NameAr',
    field: 'lookupNameAr',
    dataType: 'string',
    required: true,
    width: '240px'
  },
  {
    labelKey:'Lookup.NameEn',
    field: 'lookupNameEn',
    dataType: 'string',
    required: true,
    width: '240px'
  },
   {
    labelKey:'Lookup.Active',
    field: 'activeFl',
    dataType: 'number',
    required: false,
    isFlag : true ,
    width: '240px'
  },





  

];




selectedLookup: Lookup | null = null;

onLookupSelected = (row: Lookup) => {
  this.selectedLookup = row;
};

onLookupFieldChanged = (e: { field: string; value: any }) => {
  if (!this.selectedLookup) return;
  (this.selectedLookup as any)[e.field] = e.value;
};

onLookupSaved = (saved: Lookup) => {
  this.selectedLookup = { ...(this.selectedLookup ?? {}), ...saved };
};


selectedDetail: LookupDetail | null = null;

onDetailSelected = (row: LookupDetail) => {
  this.selectedDetail = row;
};

onDetailFieldChanged = ({ field, value }: { field: string; value: any }) => {
  if (!this.selectedDetail) return;
  (this.selectedDetail as any)[field] = value;
};

onDetailSaved = (saved: LookupDetail) => {
  // لو عندك patchRowById في الجدول:
  // this.table.patchRowById(saved.lookupDetailPk, saved);
  this.selectedDetail = { ...(this.selectedDetail ?? {}), ...saved };
};





}