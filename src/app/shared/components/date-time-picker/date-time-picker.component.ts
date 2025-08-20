import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.css'],
  standalone: false
})
export class DateTimePickerComponent {
  /** قيمة الدخول/الخروج بصيغة ISO مع الإزاحة: 2025-07-14T22:49:00.000+03:00 */
  @Input() value: string | null = null;

  /** المنطقة الزمنية المطلوبة لحساب الإزاحة (+02:00/+03:00) */
  @Input() timeZone = 'Africa/Cairo';

  /** تسمية الحقل */
  @Input() label = 'التاريخ والوقت';

  /** يبعث نفس الصيغة (ISO + offset) عند التغيير */
  @Output() valueChange = new EventEmitter<string | null>();

  /** القيمة المعرَضة داخل input=datetime-local (بدون ثواني/منطقة) */
  get localValue(): string | null {
    return this.isoToLocalInput(this.value);
  }

  /** عند تغيير المستخدم للقيمة داخل الحقل */
  onChange(val: string) {
    if (!val) { this.valueChange.emit(null); return; }
    // val مثال: 2025-07-14T22:49
    const out = this.localInputToIsoWithOffset(val, this.timeZone);
    this.valueChange.emit(out);
  }

  /** يحوّل ISO مع إزاحة إلى قيمة صالحة لـ datetime-local (yyyy-MM-ddTHH:mm) */
  private isoToLocalInput(iso: string | null): string | null {
    if (!iso) return null;
    const m = iso.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/);
    return m ? `${m[1]}T${m[2]}` : null;
  }

  /** يحوّل قيمة datetime-local إلى ISO + offset للمنطقة المحددة */
  private localInputToIsoWithOffset(local: string, timeZone: string): string {
    // local: YYYY-MM-DDTHH:mm (بدون ثواني/منطقة)
    const [ymd, hm] = local.split('T');                 // ymd=YYYY-MM-DD, hm=HH:mm
    const offset = this.offsetForZone(ymd, timeZone);   // +03:00 أو +02:00 حسب التاريخ
    const [hh, mm] = hm.split(':');
    return `${ymd}T${hh.padStart(2,'0')}:${mm.padStart(2,'0')}:00.000${offset}`;
  }

  /** يحسب إزاحة المنطقة (مثلاً GMT+3 → +03:00) في هذا التاريخ */
  private offsetForZone(ymd: string, timeZone: string): string {
    // نستخدم منتصف اليوم UTC لنفس التاريخ لتحديد الإزاحة الصيفية/الشتوية
    const d = new Date(`${ymd}T12:00:00Z`);
    const parts = new Intl.DateTimeFormat('en', {
      timeZone,
      hour12: false,
      timeZoneName: 'shortOffset'
    }).formatToParts(d);
    const tz = parts.find(p => p.type === 'timeZoneName')?.value || 'GMT+0';
    const m = tz.match(/GMT([+-]\d{1,2})/);
    const hours = m ? parseInt(m[1], 10) : 0;
    const sign = hours >= 0 ? '+' : '-';
    const hh = Math.abs(hours).toString().padStart(2, '0');
    return `${sign}${hh}:00`;
  }
}
