import { Component, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Language } from '../../../auth/models/language.interface';
import { LanguageService } from '../../../../core/services/shared/language.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-privacy-policy',
  standalone : false,
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent implements OnDestroy {
  lastUpdated = '2025-10-01';
  lang = 'ar';
  direction: 'rtl' | 'ltr' = 'rtl';
  private sub: Subscription;


  constructor(
    public translate: TranslateService,
    private titleService: Title,
  ) {
    this.sub = this.translate.onLangChange.subscribe(e => {
      this.lang = e.lang;
      this.direction = this.isRtl(this.lang) ? 'rtl' : 'ltr';
    });

  }

  private isRtl(l: string): boolean {
    return ['ar', 'fa', 'ur', 'he'].includes((l || '').toLowerCase());
  }




  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
