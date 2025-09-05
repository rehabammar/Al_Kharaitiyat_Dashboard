import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import {  onMessage } from 'firebase/messaging';
import { MessagingBridgeService } from './core/services/shared/messaging-bridge.service';
import { Messaging } from '@angular/fire/messaging';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor(
     private titleService: Title ,
     private translateService: TranslateService ,
     private messaging: Messaging,
     private bridge: MessagingBridgeService ){}
  ngOnInit(): void {
    this.translateService.get('app-name').subscribe((translatedTitle: string) => {
      this.titleService.setTitle(translatedTitle);  
    });
    this.handleFirebaseNotifications() ;
  }

  handleFirebaseNotifications() {

    onMessage(this.messaging, (payload) => {
      console.log("Message received in foreground: ", payload);
      // alert(payload.notification?.title + ": " + payload.notification?.body);

      const title = payload.notification?.title || 'New message';
      const options = {
        body: payload.notification?.body,
        icon: "/assets/img/logo/logo.png",
        data: { refresh: true } // علامة مفيدة
      };
      const audio = new Audio('assets/sounds/notification_sound.wav');
      audio.play();
      new Notification(title, options);
      this.bridge.emit({ type: 'REFRESH', payload, source: 'foreground' });


    });
  }
}
