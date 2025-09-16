import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ApiEndpoints } from '../../constants/api-endpoints';

export interface OrgImagesPayload {
  orgId: number;
  logo?: File | null;
  sliders: (File | null)[];      // length 5
  clearLogo?: boolean;
  clearSliders?: boolean[];      // length 5
}

@Injectable({ providedIn: 'root' })
export class ImageUploadService {
  constructor(private http: HttpClient) {}

  uploadOrgImages(payload: OrgImagesPayload, opts: { debug?: boolean } = {}): Observable<any> {
    const { debug = false } = opts;

    const form = new FormData();
    form.append('orgId', String(payload.orgId));

    // Logo: أضِف فقط لو تغيّر (ملف) أو حذف
    if (payload.logo) {
      form.append('logo', payload.logo);
    } else if (payload.clearLogo) {
      form.append('logo', 'null'); // بدّليها "" لو API يتوقع empty string
    }

    // Sliders: أضِف فقط الخانات المتغيّرة/المحذوفة
    for (let i = 0; i < 5; i++) {
      const f = payload.sliders[i] ?? null;
      const wantDelete = !!payload.clearSliders?.[i];
      if (f) {
        form.append(`sliderImg${i + 1}`, f);
      } else if (wantDelete) {
        form.append(`sliderImg${i + 1}`, 'null'); // أو ""
      }
      // غير ذلك: لا تُرسل المفتاح ← يظل كما هو في السيرفر
    }

    if (debug) {
      this.logPayload(payload);
      this.logFormDataDetailed(form);
    }

    const url = ApiEndpoints.updateImageOrganization();
    const req$ = this.http.post(url, form);

    return debug
      ? req$.pipe(
          tap((res) => {
            console.groupCollapsed('%c[Upload] ✅ Response', 'color:#16a34a;font-weight:600');
            console.log('URL:', url);
            console.log('Response:', res);
            console.groupEnd();
          }),
          catchError((err) => {
            console.groupCollapsed('%c[Upload] ❌ Error', 'color:#dc2626;font-weight:600');
            console.log('URL:', url);
            console.error(err);
            console.groupEnd();
            return throwError(() => err);
          })
        )
      : req$;
  }

  // ============ DEBUG HELPERS ============

  /** يطبع ملخص الـpayload (هل في ملف/حذف لكل خانة) */
  private logPayload(payload: OrgImagesPayload) {
    console.groupCollapsed('%c[Upload] ⬆️ Payload summary', 'color:#2563eb;font-weight:600');
    console.table({
      orgId: payload.orgId,
      logoFile: payload.logo ? `${payload.logo.name} (${payload.logo.type}, ${payload.logo.size}B)` : null,
      clearLogo: !!payload.clearLogo,
      slidersCount: payload.sliders?.length ?? 0
    });

    const slidersInfo = Array.from({ length: 5 }, (_, i) => {
      const f = payload.sliders[i];
      const del = payload.clearSliders?.[i] ?? false;
      return {
        slot: i + 1,
        file: f ? `${f.name} (${f.type}, ${f.size}B)` : null,
        clear: del
      };
    });
    console.table(slidersInfo);
    console.groupEnd();
  }

  /**
   * يطبع الـFormData بشكل مفصل:
   * - لكل مفتاح مُخطط (orgId, logo, sliderImg1..5): يوضح إذا اتبعت ولا “omitted”
   * - لو اتبعت كـFile: يطبع الاسم/النوع/الحجم
   * - لو اتبعت كنص: يطبع القيمة ("null" أو غيره)
   */
  private logFormDataDetailed(fd: FormData) {
    console.groupCollapsed('%c[Upload] 📨 Outgoing FormData', 'color:#7c3aed;font-weight:600');

    // اجمع القيم في خريطة تسهّل الفحص
    const map = new Map<string, any[]>();
    fd.forEach((v, k) => {
      const arr = map.get(k) ?? [];
      arr.push(v);
      map.set(k, arr);
    });

    const plannedKeys = ['orgId', 'logo', ...Array.from({ length: 5 }, (_, i) => `sliderImg${i + 1}`)];

    const rows = plannedKeys.map((key) => {
      const vals = map.get(key);
      if (!vals || vals.length === 0) {
        return { key, sent: false, kind: '—', name: '—', type: '—', size: '—', value: '—' };
      }
      const v = vals[0];
      if (v instanceof File) {
        return {
          key,
          sent: true,
          kind: 'File',
          name: v.name,
          type: v.type || '(unknown)',
          size: `${v.size} B`,
          value: '—'
        };
      }
      return {
        key,
        sent: true,
        kind: 'Text',
        name: '—',
        type: '—',
        size: '—',
        value: String(v)
      };
    });

    console.table(rows);

    // اطبع أي مفاتيح إضافية غير مخططة (لو فيه)
    const extras: any[] = [];
    map.forEach((vals, k) => {
      if (!plannedKeys.includes(k)) {
        const v = vals[0];
        extras.push({
          key: k,
          kind: v instanceof File ? 'File' : 'Text',
          name: v instanceof File ? v.name : '—',
          type: v instanceof File ? (v.type || '(unknown)') : '—',
          size: v instanceof File ? `${v.size} B` : '—',
          value: v instanceof File ? '—' : String(v)
        });
      }
    });
    if (extras.length) {
      console.log('%cExtra keys detected in FormData:', 'color:#a16207');
      console.table(extras);
    }

    console.groupEnd();
  }
}
