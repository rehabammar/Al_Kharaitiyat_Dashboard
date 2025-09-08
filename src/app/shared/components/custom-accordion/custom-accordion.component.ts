import { Component, Input, AfterViewInit, ViewChild, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';

@Component({
  selector: 'app-custom-accordion',
  templateUrl: './custom-accordion.component.html',
  styleUrls: ['./custom-accordion.component.css'],
  standalone: false,
  encapsulation: ViewEncapsulation.None
})
export class CustomAccordionComponent implements AfterViewInit {
  @Input() title = '';
  @ViewChild(MatExpansionPanel) panel!: MatExpansionPanel;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    queueMicrotask(() => {            // or: Promise.resolve().then(...)
      this.panel.open();
      this.cdr.detectChanges();       // ensure stable view after the change
    });
  }
}
