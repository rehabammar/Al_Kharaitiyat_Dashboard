import { Component, Input, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';

@Component({
  selector: 'app-custom-accordion',
  templateUrl: './custom-accordion.component.html',
  styleUrls: ['./custom-accordion.component.css'],
  standalone: false ,
  encapsulation: ViewEncapsulation.None
})
export class CustomAccordionComponent implements AfterViewInit{
  @Input() title: string = '';
  @ViewChild(MatExpansionPanel) panel!: MatExpansionPanel;


  ngAfterViewInit() {
    this.panel.open();
  }

}
