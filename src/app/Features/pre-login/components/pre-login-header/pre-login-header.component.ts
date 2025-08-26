import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pre-login-header',
  standalone: false,
  templateUrl: './pre-login-header.component.html',
  styleUrl: './pre-login-header.component.css'
})
export class PreLoginHeaderComponent {


constructor(private router: Router) {}

goToLogin(e?: Event) {
  e?.preventDefault();                 // يمنع التنقل الإفتراضي للـ <a>
  this.router.navigate(['/login'], { replaceUrl: true });
}


}
