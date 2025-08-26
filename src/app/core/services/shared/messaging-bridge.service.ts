import { Injectable, NgZone } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface BridgeEvent {
  type: 'REFRESH' | string;
  payload?: any;
  source?: 'sw' | 'foreground' | 'notificationclick';
}

@Injectable({ providedIn: 'root' })
export class MessagingBridgeService {
  private _events$ = new Subject<BridgeEvent>();
  events$: Observable<BridgeEvent> = this._events$.asObservable();

  constructor(private zone: NgZone) {
    // اسمع رسائل ال-Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (e: MessageEvent) => {
        // ادخلي المنطقة بتاعة Angular علشان الـ change detection يشتغل
        this.zone.run(() => this._events$.next({ ...e.data, source: 'sw' }));
      });
    }
  }

  // استخدميها من foreground onMessage
  emit(event: BridgeEvent) { this._events$.next(event); }
}
