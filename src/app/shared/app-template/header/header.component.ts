import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../Features/auth/services/user.service';
import { getMessaging, deleteToken } from "firebase/messaging";

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {


  constructor(private router: Router, private userService: UserService) { }

  async handleLogoutClick() {
    this.userService.clearUser();
    const messaging = getMessaging();
    await deleteToken(messaging);
    window.location.replace('/login');
  }
  mobileMenuOpen = false;

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

}
