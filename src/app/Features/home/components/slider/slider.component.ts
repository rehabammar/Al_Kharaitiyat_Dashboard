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


  currentLang: string = 'ar';

  org$!: Observable<Organization | null>;

  constructor(private orgStore: PreLoginService) { }

  ngOnInit() {
    this.org$ = this.orgStore.organization$;
    this.orgStore.load().subscribe();
  }


}
