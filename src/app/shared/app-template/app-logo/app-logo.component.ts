import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Organization } from '../../../Features/pre-login/model/organization.model';
import { PreLoginService } from '../../../Features/pre-login/services/pre-login.service';

@Component({
  selector: 'app-logo',
  standalone: false,
  templateUrl: './app-logo.component.html',
  styleUrls: ['./app-logo.component.css']
})
export class AppLogoComponent implements OnInit {
  @Input() fallbackSrc = 'assets/img/logo/logo.png';
  @Input() className = 'app-logo';
  @Input() bustOnChange = true;

  org$!: Observable<Organization | null>;
  private cacheBust = 0;
  broken = false;

  constructor(private orgStore: PreLoginService) {}

  ngOnInit(): void {
    this.org$ = this.orgStore.organization$;
    this.orgStore.load().subscribe();

    if (this.bustOnChange) {
      this.org$.subscribe(() => (this.cacheBust = Date.now()));
    }
  }

  srcOf(org: Organization | null | undefined): string {
    if (this.broken) return this.fallbackSrc;
    const url = org?.logoFullUrl ?? (org as any)?.logoUrl ?? '';
    if (!url) return this.fallbackSrc;
    if (!this.bustOnChange || !this.cacheBust) return url;
    return url + (url.includes('?') ? '&' : '?') + 'v=' + this.cacheBust;
  }

  altOf(org: Organization | null | undefined): string {
    return org?.organizationNameAr || org?.organizationNameEn || 'Logo';
  }

  onError() {
    this.broken = true;
  }
}
