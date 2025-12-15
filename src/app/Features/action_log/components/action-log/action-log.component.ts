
import { Component, ViewChild } from '@angular/core';
import { GenericTableComponent } from '../../../../shared/components/table-components/generic-table/generic-table.component';
import { TableColumn } from '../../../../core/models/table-column.interface';
import { ActionLog } from '../../model/action-log.model';


@Component({
  selector: 'app-action-log',
  standalone: false,
  templateUrl: './action-log.component.html',
  styleUrl: './action-log.component.css'
})
export class ActionLogComponent {

  @ViewChild('logTable') logTable!: GenericTableComponent<ActionLog>;

  dataFactory = () => new ActionLog();

  columns: TableColumn[] = [
    {
      labelKey: 'ActionLog.Id',
      field: 'actionLogPk',
      dataType: 'number',
      width: '90px'
    },
    {
      labelKey: 'ActionLog.User',
      field: 'userFk',
      width: '160px'
    },
    {
      labelKey: 'ActionLog.Username',
      field: 'fullName',
      width: '160px'
    },
    {
      labelKey: 'ActionLog.ActionType',
      field: 'operation',
      width: '120px'
    },
    {
      labelKey: 'ActionLog.TableName',
      field: 'tableNameAr',
      width: '150px'
    },
    {
      labelKey: 'ActionLog.RecordId',
      field: 'recordFk',
      width: '120px'
    },
    // {
    //   labelKey: 'ActionLog.IpAddress',
    //   field: 'ipAddress',
    //   width: '140px'
    // },
    {
      labelKey: 'ActionLog.ActionDate',
      field: 'creationDate',
      dataType: 'datetime',
      width: '180px'
    }
  ];

}
