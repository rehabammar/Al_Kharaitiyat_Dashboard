import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: false,
  selector: 'app-button',
  templateUrl: './app-button.component.html',
  styleUrl: './app-button.component.css' ,
})
export class AppButtonComponent {
  @Input() label! : string ;
  @Input() imageSrc : any ;
  @Input() color : any ;
  @Input() onClick: (() => void) | undefined;
  @Input() showButton : boolean = true ;
  @Input() disabled: boolean = false;


}





