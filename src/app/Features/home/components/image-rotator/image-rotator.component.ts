import { Component, Input, OnInit, OnDestroy, HostListener } from '@angular/core';

type ImageItem = { src: string; alt?: string; href?: string };

@Component({
  selector: 'app-image-rotator',
  standalone: false,
  templateUrl: './image-rotator.component.html',
  styleUrls: ['./image-rotator.component.css']
})
export class ImageRotatorComponent implements OnInit, OnDestroy {
  /** Optional: you can pass images from parent.
   * If not provided, we'll use the static IMAGES below.
   */

  /** Autoplay interval (ms) */
  @Input() intervalMs = 4000;

  /** Show arrows & dots */
  @Input() showArrows = true;
  @Input() showDots = true;

  /** If true, automatically rotate */
  @Input() autoplay = true;

  // Fallback static list (your “static images” requirement)
    images: ImageItem[] = [
    { src: 'assets/img/dashborad-img/slide-1.png', alt: 'Classroom' },
    { src: 'assets/img/dashborad-img/slide-2.png', alt: 'Teacher with students' },
    { src: 'assets/img/dashborad-img/slide-3.png', alt: 'Online session' },
    { src: 'assets/img/dashborad-img/slide-4.png', alt: 'Online session' },
    { src: 'assets/img/dashborad-img/slide-5.png', alt: 'Online session' },

  ];


  

  current = 0;
  private timerId: any = null;
  isPaused = false;

  get list(): ImageItem[] {
    return  this.images;
  }

  ngOnInit(): void {
    if (this.autoplay) this.start();
  }

  ngOnDestroy(): void {
    this.stop();
  }

  next(): void {
    this.current = (this.current + 1) % this.list.length;
  }

  prev(): void {
    this.current = (this.current - 1 + this.list.length) % this.list.length;
  }

  go(i: number): void {
    this.current = i % this.list.length;
  }

  start(): void {
    this.stop();
    if (this.list.length <= 1) return;
    this.timerId = setInterval(() => {
      if (!this.isPaused) this.next();
    }, this.intervalMs);
  }

  stop(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  // Keyboard support: ← / →
  @HostListener('document:keydown.arrowleft', ['$event'])
  onLeft(e: KeyboardEvent) { if (!this.isPaused) this.prev(); }

  @HostListener('document:keydown.arrowright', ['$event'])
  onRight(e: KeyboardEvent) { if (!this.isPaused) this.next(); }

  // Pause on hover handlers
  onEnter() { this.isPaused = true; }
  onLeave() { this.isPaused = false; }
}
