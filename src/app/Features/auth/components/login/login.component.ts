import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Language } from '../../models/language.interface';
import { LanguageService } from '../../../../core/services/shared/language.service';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { Messaging } from '@angular/fire/messaging';
import { getToken, onMessage } from 'firebase/messaging';
import { MessagingBridgeService } from '../../../../core/services/shared/messaging-bridge.service';



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
    private bridge: MessagingBridgeService

  ) { }
  ngOnInit(): void {
    this.requestPermission();
    this.LoadLanguage();
  }

  // (optional) keep your console debug
  onSubmit() {
    // not used anymore; form uses (ngSubmit)="useLogin()"
    console.log('Email:', this.userName);
    console.log('Password:', this.password);
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
      vapidKey: "BBGADUbR7r84W8iKcirY5DgLDee33UQkila-2xZ_j--luznCg9ZflgatJBjH5hV3GKn7l-O5qDFgGum45f5F73Q" // من Firebase Console
    }).then((currentToken) => {
      if (currentToken) {
        console.log("Got FCM token:", currentToken);
        // ابعته للسيرفر بتاعك
        this.firebaseToken = currentToken;
      } else {
        console.log("No registration token available.");
      }
    }).catch((err) => {
      console.error("An error occurred while retrieving token. ", err);
    });

    // استقبال رسالة foreground
    onMessage(this.messaging, (payload) => {
      console.log("Message received in foreground: ", payload);
      // alert(payload.notification?.title + ": " + payload.notification?.body);

      const title = payload.notification?.title || 'New message';
      const options = {
        body: payload.notification?.body,
        icon: "/assets/img/logo/logo.png",
        data: { refresh: true } // علامة مفيدة
      };
      // self.registration.showNotification(title, options);
      const audio = new Audio('assets/sounds/notification_sound.wav');
      audio.play();
      new Notification(title, options);
      this.bridge.emit({ type: 'REFRESH', payload, source: 'foreground' });


    });
  }
}