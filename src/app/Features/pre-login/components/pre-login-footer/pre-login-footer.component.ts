import { Component, OnInit } from '@angular/core';
import { PreLoginService } from '../../services/pre-login.service';
import { Organization } from '../../model/organization.model';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-pre-login-footer',
  standalone: false,
  templateUrl: './pre-login-footer.component.html',
  styleUrl: './pre-login-footer.component.css'
})
export class PreLoginFooterComponent {


  organization$: Observable<Organization>;

  constructor(private preLoginService: PreLoginService) {
    this.organization$ = this.preLoginService.getOrganizations(); 
  }


}
