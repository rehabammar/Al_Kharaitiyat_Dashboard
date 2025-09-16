import { Component } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { PreLoginService } from '../../../pre-login/services/pre-login.service';
import { Organization } from '../../../pre-login/model/organization.model';
import { Language } from '@ngx-translate/core';
import { LanguageService } from '../../../../core/services/shared/language.service';

@Component({
  selector: 'app-slider',
  standalone: false,
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css'
})
export class SliderComponent {

    organization$: Observable<Organization>;

    currentLang : string = 'ar' ;
  
    constructor(private preLoginService: PreLoginService  ) {
      this.organization$ = this.preLoginService.getOrganizations(); 
      this.currentLang = LanguageService.getLanguage()?.langCode ?? 'ar' ;
    }

}
