// image-upload.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ApiEndpoints } from '../../constants/api-endpoints';

export interface OrgImagesPayload {
  orgId: number;
  logo?: File | null;
  sliders: (File | null)[];      // length 5
  clearLogo?: boolean;           // نحولها إلى logoD
  clearSliders?: boolean[];      // length 5 -> sliderImg{N}D
}

@Injectable({ providedIn: 'root' })
export class ImageUploadService {
  constructor(private http: HttpClient) {}

  /**
   * @param opts.lang   يرسل هيدر lang (اختياري)
   * @param opts.debug  لطباعة الـFormData والرد
   */
  uploadOrgImages(
    payload: OrgImagesPayload,
    opts: { lang?: string; debug?: boolean } = {}
  ): Observable<any> {
    const { lang, debug = false } = opts;

    const form = new FormData();
    form.append('orgId', String(payload.orgId));

    // === ملفات: نرسل الجديد فقط (لا نرسل "null" إطلاقًا) ===
    if (payload.logo) {
      form.append('logo', payload.logo);
    }
    for (let i = 0; i < 5; i++) {
      const f = payload.sliders[i] ?? null;
      if (f) form.append(`sliderImg${i + 1}`, f);
    }

    // === فلاغات الحذف: دايمًا نرسلها كـ true/false ===
    form.append('logoD', String(!!payload.clearLogo));
    for (let i = 0; i < 5; i++) {
      const del = !!(payload.clearSliders && payload.clearSliders[i]);
      form.append(`sliderImg${i + 1}D`, String(del));
    }

    if (debug) {
      this.logPayload(payload);
      this.logFormData(form);
    }

    const url = ApiEndpoints.updateImageOrganization();
    const headers = lang ? new HttpHeaders({ lang }) : undefined;

    const req$ = this.http.post(url, form, { headers });

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
            console.error('URL:', url);
            console.error(err);
            console.groupEnd();
            return throwError(() => err);
          })
        )
      : req$;
  }

  // -------- DEBUG HELPERS --------
  private logPayload(p: OrgImagesPayload) {
    console.groupCollapsed('%c[Upload] ⬆️ Payload summary', 'color:#2563eb;font-weight:600');
    console.table({
      orgId: p.orgId,
      hasLogoFile: !!p.logo,
      clearLogo: !!p.clearLogo
    });
    const sliders = Array.from({ length: 5 }, (_, i) => ({
      slot: i + 1,
      hasFile: !!p.sliders[i],
      clear: !!(p.clearSliders && p.clearSliders[i])
    }));
    console.table(sliders);
    console.groupEnd();
  }

  private logFormData(fd: FormData) {
    console.groupCollapsed('%c[Upload] 📨 Outgoing FormData', 'color:#7c3aed;font-weight:600');
    const keysExpected = [
      'orgId',
      'logo',
      'logoD',
      ...Array.from({ length: 5 }, (_, i) => `sliderImg${i + 1}`),
      ...Array.from({ length: 5 }, (_, i) => `sliderImg${i + 1}D`)
    ];
    const map = new Map<string, any[]>();
    fd.forEach((v, k) => {
      const arr = map.get(k) ?? [];
      arr.push(v);
      map.set(k, arr);
    });

    const rows = keysExpected.map((k) => {
      const vals = map.get(k);
      if (!vals || !vals.length) return { key: k, sent: false, kind: '—', value: '—', name: '—', size: '—', type: '—' };
      const v = vals[0];
      if (v instanceof File) {
        return { key: k, sent: true, kind: 'File', value: '—', name: v.name, size: `${v.size}B`, type: v.type || '(?)' };
      }
      return { key: k, sent: true, kind: 'Text', value: String(v), name: '—', size: '—', type: '—' };
    });
    console.table(rows);

    // أي مفاتيح إضافية
    map.forEach((vals, k) => {
      if (!keysExpected.includes(k)) {
        const v = vals[0];
        console.log('Extra key:', k, v instanceof File ? v.name : String(v));
      }
    });
    console.groupEnd();
  }
}
