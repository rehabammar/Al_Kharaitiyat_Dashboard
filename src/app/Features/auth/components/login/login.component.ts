import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Language } from '../../models/language.interface';
import { LanguageService } from '../../../../core/services/shared/language.service';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';



@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // <- plural fix
})
export class LoginComponent  implements OnInit{
  userName = '';
  password = '';
  loading = false;
  showError = false;
  errorMessage = '';
  languagesList: Language[] = [
  { langCode: 'ar', langName: 'عربي'  , rtlFl : 1},
  { langCode: 'en', langName: 'English' , rtlFl : 0 },
  ];


  selectedLanguage! : Language  ;
   direction!: 'rtl' | 'ltr';

  constructor(
    private loginService: LoginService , 
    private translateService: TranslateService,
    private titleService: Title ,

) { }
  ngOnInit(): void {
    this.LoadLanguage();
  }

  // (optional) keep your console debug
  onSubmit() {
    // not used anymore; form uses (ngSubmit)="useLogin()"
    console.log('Email:', this.userName);
    console.log('Password:', this.password);
  }



  LoadLanguage() {
    this.selectedLanguage = LanguageService.getLanguage() ?? this.languagesList[0] ;
    this.direction = this.selectedLanguage.rtlFl === 1 ? 'rtl' : 'ltr';
    this.translateService.setDefaultLang(this.selectedLanguage.langCode!);
    this.translateService.use(this.selectedLanguage.langCode!);
    this.setDirection(this.selectedLanguage.langCode!, this.direction);
    this.translateService.get('app-name').subscribe((translatedTitle: string) => {
      this.titleService.setTitle(translatedTitle);  
    });

  }


    changeLanguage(langCode: string) {

    if (this.selectedLanguage == this.languagesList[0]) {
      this.selectedLanguage = this.languagesList[1];
    } else {
      this.selectedLanguage = this.languagesList[0];
    }

    LanguageService.storeLanguage(this.selectedLanguage);
    this.direction = this.selectedLanguage.rtlFl === 1 ? 'rtl' : 'ltr';
    this.translateService.setDefaultLang(this.selectedLanguage.langCode!);
    this.translateService.use(this.selectedLanguage.langCode!);
    this.setDirection(this.selectedLanguage.langCode!, this.direction);
    this.translateService.get('app-name').subscribe((translatedTitle: string) => {
      this.titleService.setTitle(translatedTitle);  
    });

    // this.changeCssFile(this.direction);


  }


  setDirection(lang: string, direction: 'rtl' | 'ltr') {
    document.documentElement.dir = direction;
    document.documentElement.lang = lang;
  }


  useLogin() {
    if (!this.userName || !this.password) {
      this.showError = true;
      this.errorMessage = 'Please fill in email and password.';
      return;
    }

    // this.loading = true;
    this.showError = false;
    this.errorMessage = '';

    this.loginService.login(this.userName, this.password);
  }
}
