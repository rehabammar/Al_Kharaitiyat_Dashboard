import { Component } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { PreLoginService } from '../../../pre-login/services/pre-login.service';
import { Organization } from '../../../pre-login/model/organization.model';

@Component({
  selector: 'app-slider',
  standalone: false,
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css'
})
export class SliderComponent {

    organization$: Observable<Organization>;
  
    constructor(private preLoginService: PreLoginService) {
      this.organization$ = this.preLoginService.getOrganizations(); 
    }

}
