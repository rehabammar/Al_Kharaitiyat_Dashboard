import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Language } from '../../models/language.interface';
import { LanguageService } from '../../../../core/services/shared/language.service';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { Messaging } from '@angular/fire/messaging';
import { getToken, onMessage } from 'firebase/messaging';



@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // <- plural fix
})
export class LoginComponent implements OnInit {
  userName = '';
  password = '';
  loading = false;
  showError = false;
  errorMessage = '';
  languagesList: Language[] = [
    { langCode: 'ar', langName: 'عربي', rtlFl: 1 },
    { langCode: 'en', langName: 'English', rtlFl: 0 },
  ];


  selectedLanguage!: Language;
  direction!: 'rtl' | 'ltr';
  firebaseToken: string = "";

  constructor(
    private loginService: LoginService,
    private translateService: TranslateService,
    private titleService: Title,
    private messaging: Messaging,

  ) { }
  ngOnInit(): void {
    this.requestPermission();
    this.LoadLanguage();
  }




  LoadLanguage() {
    this.selectedLanguage = LanguageService.getLanguage() ?? this.languagesList[0];
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

    this.loginService.login(this.userName, this.password, this.firebaseToken);
  }

  requestPermission() {
    getToken(this.messaging, {
      vapidKey: "BBGADUbR7r84W8iKcirY5DgLDee33UQkila-2xZ_j--luznCg9ZflgatJBjH5hV3GKn7l-O5qDFgGum45f5F73Q" 
    }).then((currentToken) => {
      if (currentToken) {
        // console.log("Got FCM token:", currentToken);
        this.firebaseToken = currentToken;
      } else {
        // console.log("No registration token available.");
      }
    }).catch((err) => {
      console.error("An error occurred while retrieving token. ", err);
    });

  
  }
}