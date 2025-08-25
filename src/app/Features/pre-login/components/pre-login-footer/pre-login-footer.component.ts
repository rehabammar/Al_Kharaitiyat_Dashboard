import { Component, OnInit } from '@angular/core';
import { PreLoginService } from '../../services/pre-login.service';
import { Organization } from '../../model/organization.model';

@Component({
  selector: 'app-pre-login-footer',
  standalone: false,
  templateUrl: './pre-login-footer.component.html',
  styleUrl: './pre-login-footer.component.css'
})
export class PreLoginFooterComponent implements OnInit {

  constructor(private preLoginService: PreLoginService) { }

  organization!: Organization;

  ngOnInit(): void {
    this.preLoginService.getOrganizations().subscribe({
      next: (org) => this.organization = org,
    });
  }


}
