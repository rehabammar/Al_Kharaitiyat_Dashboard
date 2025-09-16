// image-manager.component.ts
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges
} from '@angular/core';
import { ImageItem } from '../../core/models/image-item.model';
import {
  ImageUploadService,
  OrgImagesPayload
} from '../../core/services/shared/image-upload.service';
import { Organization } from '../../Features/pre-login/model/organization.model';

@Component({
  selector: 'app-image-manager',
  standalone: false,
  templateUrl: './image-manager.component.html',
  styleUrls: ['./image-manager.component.css']
})
export class ImageManagerComponent implements OnDestroy, OnChanges {
  /** المنظمة القادمة من الأب */
  @Input() organization: Organization | null = null;
  @Output() imagesChange = new EventEmitter<ImageItem[]>();

  /** صور حالية (من السيرفر) */
  currentLogoUrl: string | null = null;
  currentSliderUrls: (string | null)[] = [null, null, null, null, null];

  /** إعدادات عامة */
  orgId = 0;
  maxSizeMB = 8;

  /** ملفات ومعاينات محلية (اختيار جديد قبل الرفع) */
  private logoFile: File | null = null;
  logoPreview: string | null = null;

  private sliderFiles: (File | null)[] = [null, null, null, null, null];
  sliderPreviews: (string | null)[] = [null, null, null, null, null];

  /** حذف عند الحفظ: إرسال null بدلاً من الصورة */
  clearLogoOnSave = false;
  clearSliderOnSave: boolean[] = [false, false, false, false, false];

  /** حالات */
  uploading = false;
  uploadError = '';
  okMsg = '';

  /** جاليري اختياري */
  images: ImageItem[] = [];

  private readonly sliderKeys = [
    'sliderImg1FullUrl',
    'sliderImg2FullUrl',
    'sliderImg3FullUrl',
    'sliderImg4FullUrl',
    'sliderImg5FullUrl'
  ] as const;

  constructor(private uploadSvc: ImageUploadService) { }

  // مزامنة عند تغيّر الـ organization
  ngOnChanges(changes: SimpleChanges): void {
    if ('organization' in changes) this.syncFromOrganization();
  }


  // ---------- Handlers ----------
  onLogoChange(e: Event): void {
    const f = (e.target as HTMLInputElement).files?.[0] || null;
    if (!this.isAcceptable(f)) return;
    this.clearLogo(); // امسح معاينة سابقة لو موجودة
    this.logoFile = f;
    this.logoPreview = f ? URL.createObjectURL(f) : null;
    this.clearLogoOnSave = false; // اختيار ملف يلغى "حذف عند الحفظ"
  }

  onSliderChange(i: number, e: Event): void {
    const f = (e.target as HTMLInputElement).files?.[0] || null;
    if (!this.isAcceptable(f)) return;
    this.clearSlider(i); // امسح معاينة سابقة لهذا الخانة
    this.sliderFiles[i] = f;
    this.sliderPreviews[i] = f ? URL.createObjectURL(f) : null;
    this.clearSliderOnSave[i] = false; // اختيار ملف يلغى "حذف عند الحفظ" لتلك الخانة
  }

  // مسح المعاينة المحلية فقط (لا يحذف من السيرفر)
  clearLogo(): void {
    if (this.logoPreview) URL.revokeObjectURL(this.logoPreview);
    this.logoPreview = null;
    this.logoFile = null;
  }

  clearSlider(i: number): void {
    const url = this.sliderPreviews[i];
    if (url) URL.revokeObjectURL(url);
    this.sliderPreviews[i] = null;
    this.sliderFiles[i] = null;
  }

  // ---------- Validation ----------
  hasAnyFile(): boolean {
    return !!this.logoFile || this.sliderFiles.some(f => !!f);
  }

  /** نحسب وجود أي فعل حقيقي (ملفات جديدة أو حذف محسوب) */
  hasAnyAction(): boolean {
    const { clearLogo, clearSliders } = this.computeClearFlags();
    const hasNewFiles = !!this.logoFile || this.sliderFiles.some(Boolean);
    const hasClears = clearLogo || clearSliders.some(Boolean);
    return hasNewFiles || hasClears;
  }

  private isAcceptable(f: File | null): boolean {
    this.uploadError = '';
    if (!f) return true;
    if (!f.type.startsWith('image/')) {
      this.uploadError = 'Only image files are allowed.';
      return false;
    }
    if (f.size > this.maxSizeMB * 1024 * 1024) {
      this.uploadError = `Max ${this.maxSizeMB}MB per image.`;
      return false;
    }
    return true;
  }

  /** يحسب فلاغات الحذف بأمان: صورة قديمة + مفيش ملف جديد + المستخدم فعّل حذف */
  private computeClearFlags() {
    const clearLogo =
      !!this.currentLogoUrl &&   // في صورة قديمة
      !this.logoFile &&          // مفيش ملف جديد
      !!this.clearLogoOnSave;    // المستخدم فعّل حذف

    const clearSliders = this.sliderFiles.map((f, i) =>
      !!this.currentSliderUrls[i] && // في صورة قديمة
      !f &&                          // مفيش ملف جديد
      !!this.clearSliderOnSave[i]    // المستخدم فعّل حذف
    );

    return { clearLogo, clearSliders };
  }

  // ---------- Upload (يدعم حذف عند الحفظ بإرسال null) ----------
  upload(): void {
    if (!this.orgId || !this.hasAnyAction()) return;

    const { clearLogo, clearSliders } = this.computeClearFlags();

    const payload: OrgImagesPayload = {
      orgId: this.orgId,
      logo: this.logoFile,              // يتبعت فقط لو مش null وسيتم ضمه في FormData
      sliders: this.sliderFiles,        // السيرفس لن يضيف إلا الخانات المتغيّرة/المحذوفة
      clearLogo,
      clearSliders
    };

    this.uploading = true; this.uploadError = ''; this.okMsg = '';

    this.uploadSvc.uploadOrgImages(payload, { debug: true }).subscribe({
      next: (res) => {
        this.uploading = false;
        this.okMsg = 'Uploaded successfully.';
        this.applyResponseToOrganization(res, payload);
        this.resetLocalSelections();
        this.syncFromOrganization();
      },
      error: (err) => {
        this.uploading = false;
        this.uploadError = 'Upload failed.';
        console.error(err);
      }
    });
  }

  private syncFromOrganization(): void {
    if (!this.organization) return;

    this.orgId = this.organization.organizationsPk ?? 0;

    // logoFullUrl أو logoUrl أيهما متاح
    this.currentLogoUrl =
      (this.organization as any).logoFullUrl ??
      (this.organization as any).logoUrl ??
      null;

    this.currentSliderUrls = [
      this.organization.sliderImg1FullUrl ?? null,
      this.organization.sliderImg2FullUrl ?? null,
      this.organization.sliderImg3FullUrl ?? null,
      this.organization.sliderImg4FullUrl ?? null,
      this.organization.sliderImg5FullUrl ?? null
    ];

    // صفّر اختيارات الحذف عند تغيير المنظمة
    this.clearLogoOnSave = false;
    this.clearSliderOnSave = [false, false, false, false, false];
  }


  /**
   * اكتب قيم الرد داخل كائن المنظمة.
   * كذلك لو كان في clearOnSave ولم يرجّع السيرفر المفتاح، نضبطه null محليًا.
   */
  private applyResponseToOrganization(res: any, payload: OrgImagesPayload): void {
    if (!this.organization) return;

    // Logo (ادعم logoFullUrl/ logoUrl الاتنين)
    if ('logoFullUrl' in res || 'logoUrl' in res) {
      const newLogo = (res.logoFullUrl ?? res.logoUrl) ?? null;
      (this.organization as any).logoFullUrl = newLogo;
      (this.organization as any).logoUrl = newLogo;
    } else if (payload.clearLogo && !payload.logo) {
      (this.organization as any).logoFullUrl = null;
      (this.organization as any).logoUrl = null;
    }

    // Sliders
    this.sliderKeys.forEach((k, idx) => {
      if (k in res) {
        (this.organization as any)[k] = res[k] ?? null;
      } else if (payload.clearSliders?.[idx] && !payload.sliders[idx]) {
        (this.organization as any)[k] = null;
      }
    });
  }

  /** تنظيف كل المعاينات والـ flags بعد الرفع */
  private resetLocalSelections(): void {
    this.clearLogo();
    this.sliderPreviews.forEach((_, i) => this.clearSlider(i));
    this.clearLogoOnSave = false;
    this.clearSliderOnSave = [false, false, false, false, false];
  }

  // جاليري (اختياري)
  removeImage(img: ImageItem): void {
    // يفترض ImageItem فيه id
    // لو مش موجود في موديلك احذف الميثود دي
    // @ts-ignore
    this.images = this.images.filter((x: any) => x.id !== (img as any).id);
    this.imagesChange.emit(this.images);
  }

  // ---------- Cleanup ----------
  ngOnDestroy(): void {
    if (this.logoPreview) URL.revokeObjectURL(this.logoPreview);
    this.sliderPreviews.forEach(u => { if (u) URL.revokeObjectURL(u); });
  }

  toggleLogoDelete() {
    if (this.logoPreview || !this.currentLogoUrl) return; // حماية
    this.clearLogoOnSave = !this.clearLogoOnSave;
  }

  toggleSliderDelete(i: number) {
    if (this.sliderPreviews[i] || !this.currentSliderUrls[i]) return; // حماية
    this.clearSliderOnSave[i] = !this.clearSliderOnSave[i];
  }

}
