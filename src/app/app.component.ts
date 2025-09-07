import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { onMessage } from 'firebase/messaging';
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
    private titleService: Title,
    private translateService: TranslateService,
    private messaging: Messaging,
    private bridge: MessagingBridgeService) { }
  ngOnInit(): void {
    this.translateService.get('app-name').subscribe((translatedTitle: string) => {
      this.titleService.setTitle(translatedTitle);
    });
    this.handleFirebaseNotifications();
    navigator.serviceWorker.addEventListener('message', (event: MessageEvent) => {
      if (event.data?.type === 'PLAY_SOUND') {
        this.playSound();
      }
    });
  }

  private async playSound() {
    try {
      const audio = new Audio('assets/sounds/notification_sound.wav');
      await audio.play();
    } catch (err) {
      console.warn('Browser blocked autoplay, user gesture needed', err);
    }
  }

  async handleFirebaseNotifications() {

    const reg = await navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: '/' });
    await navigator.serviceWorker.ready;

    onMessage(this.messaging,async (payload)  =>   {
      console.log("Message received in foreground: ", payload);

      const title = payload.notification?.title || 'New message';
      const options = {
        body: payload.notification?.body,
        icon: "/assets/img/logo/logo.png",
        data: { refresh: true } 
      };
      const audio = new Audio('assets/sounds/notification_sound.wav');
      audio.play();
      // alert(payload.notification?.title + ": " + payload.notification?.body);
      // await reg.showNotification(title, options);
      new Notification(title, options);
      this.bridge.emit({ type: 'REFRESH', payload, source: 'foreground' });


    });
  }
}
