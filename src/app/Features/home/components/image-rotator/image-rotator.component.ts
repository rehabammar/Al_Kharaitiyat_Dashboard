import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  HostListener
} from '@angular/core';
import { Organization } from '../../../pre-login/model/organization.model';

type ImageItem = { src: string; alt?: string; href?: string };

@Component({
  selector: 'app-image-rotator',
  standalone: false,
  templateUrl: './image-rotator.component.html',
  styleUrls: ['./image-rotator.component.css']
})
export class ImageRotatorComponent implements OnInit, OnDestroy, OnChanges {
  /** Organization to pull images from */
  private _organization: Organization | null = null;
  @Input() set organization(value: Organization | null) {
    this._organization = value;
    this.hydrateImagesFromOrgOrFallback();
    this.resetIndexIfOutOfBounds();
    if (this.autoplay) this.restart();
  }
  get organization(): Organization | null { return this._organization; }

  /** If true and logoUrl exists, put logo as the first slide */
  @Input() includeLogoFirst = false;

  /** Keep duplicate URLs as separate slides (controls dots count) */
  @Input() keepDuplicates = true;

  /** Pause rotation when mouse over */
  @Input() pauseOnHover = true;

  /** Autoplay interval (ms) */
  @Input() intervalMs = 4000;

  /** Show arrows & dots */
  @Input() showArrows = true;
  @Input() showDots = true;

  /** Auto-rotate */
  @Input() autoplay = true;

  /** Fallback static list */
  private staticFallback: ImageItem[] = [
    { src: 'assets/img/dashborad-img/slide-1.png', alt: 'Classroom' },
    { src: 'assets/img/dashborad-img/slide-2.png', alt: 'Teacher with students' },
    { src: 'assets/img/dashborad-img/slide-3.png', alt: 'Online session' },
    { src: 'assets/img/dashborad-img/slide-4.png', alt: 'Online session' },
    { src: 'assets/img/dashborad-img/slide-5.png', alt: 'Online session' }
  ];

  /** The list actually used by the rotator */
  images: ImageItem[] = [];

  current = 0;
  private timerId: ReturnType<typeof setInterval> | null = null;
  isPaused = false;

  ngOnInit(): void {
    // لو الأب ضبط الـ organization قبل ngOnInit، الـ setter اشتغل خلاص
    if (!this.images.length) this.hydrateImagesFromOrgOrFallback();
    if (this.autoplay) this.start();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // لو اتغيرت خصائص بتأثر على القائمة أو التايمر
    if (changes['includeLogoFirst']) {
      this.hydrateImagesFromOrgOrFallback();
      this.resetIndexIfOutOfBounds();
      if (this.autoplay) this.restart();
    }
    if (changes['intervalMs'] && !changes['intervalMs'].firstChange) {
      if (this.autoplay) this.restart();
    }
  }

  ngOnDestroy(): void { this.stop(); }

  // ===== Rotation controls =====
  next(): void {
    if (!this.images.length) return;
    this.current = (this.current + 1) % this.images.length;
  }

  prev(): void {
    if (!this.images.length) return;
    this.current = (this.current - 1 + this.images.length) % this.images.length;
  }

  go(i: number): void {
    if (!this.images.length) return;
    this.current = ((i % this.images.length) + this.images.length) % this.images.length;
  }

  start(): void {
    this.stop();
    if (this.images.length <= 1) return;
    this.timerId = setInterval(() => {
      if (!this.isPaused) this.next();
    }, this.intervalMs);
  }

  restart(): void { this.stop(); this.start(); }

  stop(): void {
    if (this.timerId) { clearInterval(this.timerId); this.timerId = null; }
  }

  @HostListener('document:keydown.arrowleft', ['$event'])
  onLeft(_: KeyboardEvent) { if (!this.isPaused) this.prev(); }

  @HostListener('document:keydown.arrowright', ['$event'])
  onRight(_: KeyboardEvent) { if (!this.isPaused) this.next(); }

  onEnter() { if (this.pauseOnHover) this.isPaused = true; }
  onLeave() { if (this.pauseOnHover) this.isPaused = false; }

  // ===== Helpers =====
  private hydrateImagesFromOrgOrFallback(): void {
    const orgImgs = this.buildImagesFromOrganization(this._organization, this.includeLogoFirst);
    this.images = orgImgs.length ? orgImgs : this.staticFallback;
  }

  private resetIndexIfOutOfBounds(): void {
    if (!this.images.length) { this.current = 0; return; }
    if (this.current >= this.images.length) this.current = 0;
  }

  private buildImagesFromOrganization(
    org: Organization | null | undefined,
    includeLogoAsFirst: boolean
  ): ImageItem[] {
    if (!org) return [];

    const urls: (string | undefined)[] = [
      org.sliderImg1FullUrl,
      org.sliderImg2FullUrl,
      org.sliderImg3FullUrl,
      org.sliderImg4FullUrl,
      org.sliderImg5FullUrl
    ];

    let list: ImageItem[] = urls
      .filter((u): u is string => !!u && typeof u === 'string')
      .map((u, idx) => ({ src: u, alt: `Slide ${idx + 1}` }));

    if (includeLogoAsFirst && org.logoUrl) {
      list = [{ src: org.logoUrl, alt: 'Logo' }, ...list];
    }

    // Deduplicate only if requested
    if (!this.keepDuplicates) {
      const seen = new Set<string>();
      list = list.filter(item => (seen.has(item.src) ? false : (seen.add(item.src), true)));
    }

    return list;
  }
}
