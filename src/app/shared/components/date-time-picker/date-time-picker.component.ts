import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.css'],
  standalone: false,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DateTimePickerComponent),
    multi: true
  }]
})
export class DateTimePickerComponent implements ControlValueAccessor, OnInit {
  @Input() timeZone: string = 'Africa/Cairo';
  @Input() label: string = 'التاريخ والوقت';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;

  disabled = false;
  touched = false;

  /** القيمة الداخلية لـ input[type=datetime-local] (yyyy-MM-ddTHH:mm) */
  localValue: string | null = null;

  /** دعم الـ picker الأصلي + فتح الـ fallback */
  supportsNativePicker = false;
  fallbackOpen = false;

  ngOnInit(): void {
    // كشف دعم showPicker()
    this.supportsNativePicker = 'showPicker' in document.createElement('input');
  }

  // CVA
  private onChange: (val: string | null) => void = () => {};
  private onTouched: () => void = () => {};
  writeValue(isoWithOffset: string | null): void { this.localValue = this.isoToLocalInput(isoWithOffset); }
  registerOnChange(fn: (val: string | null) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }

  // فتح الـ picker أو الـ fallback
  openPicker(el: HTMLInputElement) {
    if (this.supportsNativePicker && typeof (el as any).showPicker === 'function') {
      (el as any).showPicker();
    } else {
      this.fallbackOpen = true;
    }
  }
  closeFallback() { this.fallbackOpen = false; }

  // أحداث الإدخال
  handleInput(val: string) {
    this.localValue = val || null;
    const out = val ? this.localInputToIsoWithOffset(val, this.timeZone) : null;
    this.onChange(out);
  }
  markTouched() { if (!this.touched) { this.touched = true; this.onTouched(); } }

  // تحديث أجزاء التاريخ/الوقت في الـ fallback
  onDatePartChange(ymd: string) {
    const time = this.localValue?.split('T')[1] ?? '00:00';
    const local = ymd ? `${ymd}T${time}` : '';
    this.handleInput(local);
  }
  onTimePartChange(hm: string) {
    const date = this.localValue?.split('T')[0] ?? this.todayYMD();
    const local = hm ? `${date}T${hm}` : `${date}T00:00`;
    this.handleInput(local);
  }
  private todayYMD() {
    const d = new Date(); const p = (n: number) => String(n).padStart(2,'0');
    return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`;
  }

  // Helpers
  private isoToLocalInput(iso: string | null): string | null {
    if (!iso) return null;
    const m = iso.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/);
    return m ? `${m[1]}T${m[2]}` : null;
  }
  private localInputToIsoWithOffset(local: string, timeZone: string): string {
    const [ymd, hm] = local.split('T');
    const [hh, mm] = hm.split(':');
    const offset = this.offsetForZone(ymd, timeZone);
    return `${ymd}T${hh.padStart(2,'0')}:${mm.padStart(2,'0')}:00.000${offset}`;
  }
  private offsetForZone(ymd: string, timeZone: string): string {
    const d = new Date(`${ymd}T12:00:00Z`);
    const parts = new Intl.DateTimeFormat('en', { timeZone, hour12: false, timeZoneName: 'short' }).formatToParts(d);
    const tz = parts.find(p => p.type === 'timeZoneName')?.value ?? 'GMT+0';
    const m = tz.match(/GMT([+-]\d{1,2})/); const hours = m ? parseInt(m[1], 10) : 0;
    const sign = hours >= 0 ? '+' : '-'; const hh = Math.abs(hours).toString().padStart(2,'0');
    return `${sign}${hh}:00`;
  }
}
