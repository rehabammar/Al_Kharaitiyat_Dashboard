import { Component, OnInit } from '@angular/core';
import { TableColumn } from '../../../../core/models/table-column.interface';
import { Organization } from '../../../pre-login/model/organization.model';
import { SessionStorageUtil } from '../../../../core/util/session-storage';
import { AppConstants } from '../../../../core/constants/app_constants';
import { ButtonVisibilityConfig } from '../../../../core/models/button-visibility-config.interface';
import { Observable } from 'rxjs/internal/Observable';
import { PreLoginService } from '../../../pre-login/services/pre-login.service';


@Component({
  selector: 'app-organization-details',
  standalone: false,
  templateUrl: './organization-details.component.html',
  styleUrl: './organization-details.component.css'
})
export class OrganizationDetailsComponent {


  organization$: Observable<Organization>;

  constructor(private preLoginService: PreLoginService) {
    this.organization$ = this.preLoginService.getOrganizations();
  }


  ButtonVisibility: ButtonVisibilityConfig = {
    showDelete: false,
    showInsert: false,
    showSave: true
  }




  organizationDataFactory = () => new Organization();

  onOrganizationSaved(row: Organization) {
    SessionStorageUtil.setItem(AppConstants.CURRENT_ORGNIZATION_KEY, row)!;
  }




  organizationColumns: TableColumn[] = [
    // PK (رمز)
    {
      field: "organizationsPk",
      labelKey: "Organization.OrganizationsPk",
      dataType: "number",
      disabled: true,
      width: "100px"
    },

    // Names
    {
      field: "organizationNameAr",
      labelKey: "Organization.OrganizationNameAr",
      dataType: "string",
      required: true,
      width: "200px"
    },
    {
      field: "organizationNameEn",
      labelKey: "Organization.OrganizationNameEn",
      dataType: "string",
      required: true,
      width: "200px"
    },

    // License
    {
      field: "licenseNumber",
      labelKey: "Organization.LicenseNumber",
      required: true,
      dataType: "number",
      width: "150px"
    },

    // // Country & City
    // {
    //   field: "countryFk",
    //   labelKey: "Organization.Country",
    //   dataType: "number",
    //   isCombobox: true,
    //   apiPath: "/countries/searchAll",
    //   fieldFK: "countryFk",
    //   displayItemKey: "countryName",
    //   primaryKey: "countryPk",
    //   width: "150px"
    // },
    // {
    //   field: "cityFk",
    //   labelKey: "Organization.City",
    //   dataType: "number",
    //   isCombobox: true,
    //   apiPath: "/cities/searchAll",
    //   fieldFK: "cityFk",
    //   displayItemKey: "cityName",
    //   primaryKey: "cityPk",
    //   width: "150px"
    // },

    // Contact info
    {
      field: "phoneNumber",
      labelKey: "Organization.PhoneNumber",
      dataType: "mobile",
      required: true,
      width: "150px"
    },
    {
      field: "phoneNumber1",
      labelKey: "Organization.PhoneNumber1",
      dataType: "mobile",
      required: false,
      width: "150px"
    },
    {
      field: "phoneNumber2",
      labelKey: "Organization.PhoneNumber2",
      dataType: "mobile",
      required: false,
      width: "150px"
    },
    {
      field: "phoneNumber3",
      labelKey: "Organization.PhoneNumber3",
      dataType: "mobile",
      required: false,
      width: "150px"
    },
    {
      field: "whatsappNumber",
      labelKey: "Organization.WhatsappNumber",
      dataType: "mobile",
      required: true,
      width: "150px"
    },
    {
      field: "email",
      labelKey: "Organization.Email",
      dataType: "string",
      required: true,
      width: "200px"
    },
    // Logo
    // {
    //   field: "logoUrl",
    //   labelKey: "Organization.LogoUrl",
    //   dataType: "string",
    //   width: "200px"
    // },
    // Dates
    {
      field: "joiningDate",
      labelKey: "Organization.JoiningDate",
      dataType: "date",
      width: "180px"
    },
    // {
    //   field: "expirationDate",
    //   labelKey: "Organization.ExpirationDate",
    //   dataType: "date",
    //   width: "180px"
    // },

    // Address & Location
    {
      field: "address",
      labelKey: "Organization.Address",
      dataType: "string",
      required: true,
      width: "250px"
    },
    {
      field: "lat",
      labelKey: "Organization.Lat",
      dataType: "number",
      required: true,
      width: "120px"
    },
    {
      field: "lng",
      labelKey: "Organization.Long",
      dataType: "number",
      width: "120px"
    },
    // Status
    {
      field: "statusFl",
      labelKey: "Organization.StatusFl",
      dataType: "flag",
      isFlag: true,
      width: "100px"
    },

    {
      field: "androidAppLink",
      labelKey: "Organization.downloadAndroid",
      dataType: "string",
      fullRow: true ,
      rows: 1 ,
      width: "100px"
    },

    {
      field: "appleAppLink",
      labelKey: "Organization.downloadIos",
      dataType: "string",
      fullRow: true ,
      rows: 1 ,
      width: "100px",
    },
     {
      field: "aboutUs",
      labelKey: "Organization.aboutCenter",
      dataType: "longtext",
      required : true ,
      fullRow: true ,
      width: "100px"
    },





  // aboutUs?: string ;
  // ourTarget?: string ;

    // // Parent Organization
    // {
    //   field: "organizationParentFk",
    //   labelKey: "Organization.OrganizationParentFk",
    //   dataType: "number",
    //   isCombobox: true,
    //   apiPath: "/organizations/searchAll",
    //   fieldFK: "organizationParentFk",
    //   displayItemKey: "organizationNameAr",
    //   primaryKey: "organizationsPk",
    //   width: "200px"
    // }
  ];


}
