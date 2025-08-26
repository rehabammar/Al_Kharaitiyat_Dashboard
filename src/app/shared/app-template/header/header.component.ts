import { Component } from '@angular/core';
  import { Router } from '@angular/router';
import { UserService } from '../../../Features/auth/services/user.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {


constructor(private router: Router , private userService : UserService ) {}

handleLogoutClick() {
    this.userService.clearUser();
    // this.router.navigate(['/login']);
    window.location.replace('/login');

}

}
