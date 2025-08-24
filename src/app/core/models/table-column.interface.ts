export interface TableColumn {
  field: string;
  searchField?: string;
  labelKey: string;
  required?: boolean;
  dataType?: string;
  isFlag? :boolean;
  disabled ? : boolean ;
  isCombobox?: boolean;
  fieldFK?: string;
  apiPath?: string;
  dataFactory?: () => any;
  primaryKey?: string;
  displayItemKey?: string;
  width?: string; 
  showWhen?: (row: any) => boolean;
  showInTable? : boolean  ;


}


