import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Language } from '../../../auth/models/language.interface';
import { LanguageService } from '../../../../core/services/shared/language.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-change-lang',
  standalone: false,
  templateUrl: './change-lang.component.html',
  styleUrl: './change-lang.component.css'
})
export class ChangeLangComponent {



  languagesList: Language[] = [
    { langCode: 'ar', langName: 'عربي', rtlFl: 1 },
    { langCode: 'en', langName: 'English', rtlFl: 0 },
  ];

  selectedLanguage!: Language;
  lang = 'ar';
  direction: 'rtl' | 'ltr' = 'rtl';

  constructor(
    public translate: TranslateService,
    private titleService: Title,
  ) {
    this.translate.onLangChange.subscribe(e => {
      this.lang = e.lang;
      this.direction = this.isRtl(this.lang) ? 'rtl' : 'ltr';
      this.setDirection(this.lang, this.direction);
    });

    this.LoadLanguage();
  }



  changeLanguage(langCode: string): void {
    this.selectedLanguage =
      this.selectedLanguage.langCode === 'ar' ? this.languagesList[1] : this.languagesList[0];

    LanguageService.storeLanguage(this.selectedLanguage);
    this.lang = this.selectedLanguage.langCode;
    this.direction = this.selectedLanguage.rtlFl === 1 ? 'rtl' : 'ltr';

    this.translate.setDefaultLang(this.lang);
    this.translate.use(this.lang);
    this.setDirection(this.lang, this.direction);

    this.translate.get('app-name').subscribe(translatedTitle => {
      this.titleService.setTitle(translatedTitle);
    });
  }

  setDirection(lang: string, direction: 'rtl' | 'ltr'): void {
    document.documentElement.lang = lang;
    document.documentElement.dir = direction;
  }

  LoadLanguage(): void {
    this.selectedLanguage = LanguageService.getLanguage() ?? this.languagesList[0];
    this.lang = this.selectedLanguage.langCode;
    this.direction = this.selectedLanguage.rtlFl === 1 ? 'rtl' : 'ltr';
    this.translate.setDefaultLang(this.lang);
    this.translate.use(this.lang);
    this.setDirection(this.lang, this.direction);

    this.translate.get('app-name').subscribe(translatedTitle => {
      this.titleService.setTitle(translatedTitle);
    });
  }


  private isRtl(l: string): boolean {
    return ['ar', 'fa', 'ur', 'he'].includes((l || '').toLowerCase());
  }


}
