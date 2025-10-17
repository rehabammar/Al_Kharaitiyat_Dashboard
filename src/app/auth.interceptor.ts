import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from './Features/auth/services/user.service';
import { User } from './Features/auth/models/user.model';
import { LanguageService } from './core/services/shared/language.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private userService: UserService , private route: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const userInfo: User = this.userService.getUser();

    if (userInfo) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${userInfo.authToken}`,
          userId: userInfo.userPk!.toString(),
          lang: LanguageService.getLanguage()?.langCode ?? 'ar', 
        }
      });

    //   console.log('[DEBUG] Request - URL:', request.url);
    //   console.log('[DEBUG] Request - Body:', request.body);
    //   console.log('[DEBUG] Request - Headers:', {
    //     Authorization: request.headers.get('Authorization'),
    //     userId: request.headers.get('userId'),
    //     lang:  request.headers.get('lang'),        
    //   });
    }

    return next.handle(request);
  }
}

