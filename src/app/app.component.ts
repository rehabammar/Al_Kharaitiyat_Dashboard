import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor( private titleService: Title , private translateService: TranslateService ){}
  ngOnInit(): void {
    this.translateService.get('app-name').subscribe((translatedTitle: string) => {
      this.titleService.setTitle(translatedTitle);  
    });
  }
}
