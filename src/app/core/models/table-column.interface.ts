export interface TableColumn {
  field: string;
  searchField?: boolean;
  searchFieldplaceholder?: string;
  labelKey: string;
  required?: boolean;
  dataType?: string;
  isFlag? :boolean;
  disabled ? : boolean ;
  isCombobox?: boolean;
  forceUpdateCombobox?: boolean;
  fieldFK?: string;
  apiPath?: string;
  dataFactory?: () => any;
  primaryKey?: string;
  displayItemKey?: string;
  width?: string; 
  showWhen?: (row: any) => boolean;
  showInTable? : boolean  ;
  onSearch?: () => any ; 
  showTotalAmountPaid? : boolean ;
  showTotalAmountRemaining? : boolean ;
  showTotalLabel?: boolean ;
  paramsMap?: Record<string, string>; 
  dependsOn?: string[];      
  
  rows?: number;        
  maxLength?: number;   
  fullRow?: boolean;    

  isCheckbox?: boolean;   



}


