import { Injectable } from '@angular/core';
import { AppConstants } from '../../../core/constants/app_constants';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUser: any = null;

  constructor() {
    const savedUser = sessionStorage.getItem(AppConstants.CURRENT_USER_KEY);
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }

  setUser(user: User): void {
    this.currentUser = user;
    sessionStorage.setItem(AppConstants.CURRENT_USER_KEY, JSON.stringify(user));
  }

  getUser(): User {
    return this.currentUser;
  }

  clearUser(): void {
    this.currentUser = null;
    sessionStorage.removeItem(AppConstants.CURRENT_USER_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }


  
}
