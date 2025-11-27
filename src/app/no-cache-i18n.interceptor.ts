import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class NoCacheI18nInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Only for i18n JSON files
    if (req.url.includes('/assets/i18n/') && req.url.endsWith('.json')) {
      const newReq = req.clone({
        setHeaders: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      return next.handle(newReq);
    }

    return next.handle(req);
  }
}
