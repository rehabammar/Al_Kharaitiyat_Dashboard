import { Directive, AfterViewInit } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';

@Directive({
  selector: '[removeAllTooltips]' ,
  standalone: false
})
export class RemoveAllTooltipsDirective implements AfterViewInit {

  constructor(private overlay: OverlayContainer) {}

  ngAfterViewInit(): void {
    const container = this.overlay.getContainerElement();

    const remove = () => {
      const tips = container.querySelectorAll('.mat-tooltip');
      tips.forEach(t => t.remove());
    };

    // remove existing
    remove();

    // observe future tooltip creation
    const obs = new MutationObserver(() => remove());

    obs.observe(container, {
      childList: true,
      subtree: true
    });
  }
}
