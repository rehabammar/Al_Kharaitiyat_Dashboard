import { Component, OnInit } from '@angular/core';
import { PreLoginService } from '../../services/pre-login.service';
import { Organization } from '../../model/organization.model';
import { Observable } from 'rxjs'; // ✅ مش من internal

@Component({
  selector: 'app-pre-login-footer',
  standalone: false,
  templateUrl: './pre-login-footer.component.html',
  styleUrls: ['./pre-login-footer.component.css'] // ✅ جمع
})
export class PreLoginFooterComponent implements OnInit {
  org$!: Observable<Organization | null>; // ✅ نعلن و نهيّئ لاحقًا

  constructor(private orgStore: PreLoginService) {}

  ngOnInit() {
    this.org$ = this.orgStore.organization$;   // ✅ دلوقتي orgStore متاح
    this.orgStore.load().subscribe();          // تحميل مرة واحدة
  }
}
