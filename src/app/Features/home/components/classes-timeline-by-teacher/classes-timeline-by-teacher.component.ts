
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, of } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { HomeService } from '../../services/home.servics';
import { LanguageService } from '../../../../core/services/shared/language.service';
import { MatDialog } from '@angular/material/dialog';
import { ClassDetailsFormComponent } from '../class-details-form/class-details-form.component';

import { formatDate } from '@angular/common';


type ApiClass = any; // use your real type if you have it
type Block = {
  col: string;             // CSS grid-column: "start / end"
  title: string;
  time: string;
  status: string;
  statusClass: string;
  classPk: null;
};
type TeacherRow = {
  teacherId: number | null;
  teacherLabel: string;
  blocks: Block[];
};
type HourLabel = { col: string; label: string };

@Component({
  selector: 'app-classes-timeline-by-teacher',
  standalone: false,
  templateUrl: './classes-timeline-by-teacher.component.html',
  styleUrls: ['./classes-timeline-by-teacher.component.css']
})
export class ClassesTimelineByTeacherComponent implements OnInit, OnDestroy {
  private sub?: Subscription;
  private currentLocale = 'en-US';
  private langCode = 'en'; // keep the app language code

  // ---- grid config ----
  START_HOUR = 8;       // 08:00
  END_HOUR = 24;      // 11:59 PM
  SLOT_MIN = 10;      // slot granularity (10-minute steps like your data)

  cols = 0;             // total grid columns
  hourLabels: HourLabel[] = [];
  rows: TeacherRow[] = [];
  loading = false;

  selectedDate: Date = new Date();


  constructor(private homeService: HomeService , private dialog: MatDialog) { }



  ngOnInit(): void {
    const langCode = LanguageService.getLanguage()?.langCode || 'en';
    this.currentLocale = this.resolveLocale(langCode);
    this.buildHeader();
    this.loadData();
  }

  // 1) Helpers at the top (inside the component file):

  /** Map 'ar'|'en' to stable BCP-47 tags */
  resolveLocale(lang: string | undefined): string {
    const l = (lang || '').toLowerCase();
    // prefer a concrete Arabic locale to avoid ar-SA defaults
    return l.startsWith('ar') ? 'ar-EG' : 'en-US';
  }

  /** Whether the language is Arabic */
  isArabic(lang: string | undefined): boolean {
    return (lang || '').toLowerCase().startsWith('ar');
  }

  /** Force Latin digits if needed (some engines ignore nu=latn) */
  toLatinDigits(s: string): string {
    const map: Record<string, string> = {
      '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4', '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
    };
    return s.replace(/[٠-٩]/g, d => map[d]);
  }

  /** Manual 24h formatter (fallback when Intl options are ignored) */
  manualHHmm(d: Date): string {
    const h = d.getHours().toString().padStart(2, '0');
    const m = d.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  }


  loadData() {

    this.loading = true;
    const dateStr = formatDate(this.selectedDate, 'yyyy-MM-dd', 'en-US');

    this.sub = this.homeService.getDailyClasses(dateStr)
      .pipe(
        catchError(err => {
          console.error('getDailyClasses error', err);
          return of([] as ApiClass[]);
        })
      )
      .subscribe(list => {
        this.rows = this.buildRows(list ?? []);
        this.loading = false;
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();

  }

  // ---------- helpers ----------
  // private buildHeader(): void {
  //   this.cols = ((this.END_HOUR - this.START_HOUR) * 60) / this.SLOT_MIN;
  //   this.hourLabels = [];
  //   for (let h = this.START_HOUR; h < this.END_HOUR; h++) {
  //     const startSlot = ((h - this.START_HOUR) * 60) / this.SLOT_MIN;
  //     const endSlot = ((h + 1 - this.START_HOUR) * 60) / this.SLOT_MIN;
  //     const label = this.formatHour(h);
  //     this.hourLabels.push({ col: `${startSlot + 1} / ${endSlot + 1}`, label });
  //   }
  // }


  private buildHeader(): void {
    this.cols = ((this.END_HOUR - this.START_HOUR) * 60) / this.SLOT_MIN;
    this.hourLabels = [];
    for (let h = this.START_HOUR; h < this.END_HOUR; h++) {
      const startSlot = ((h - this.START_HOUR) * 60) / this.SLOT_MIN;
      const endSlot = ((h + 1 - this.START_HOUR) * 60) / this.SLOT_MIN;
      const label = this.formatHour(h);
      this.hourLabels.push({ col: `${startSlot + 1} / ${endSlot + 1}`, label });
    }
  }
  private buildRows(list: ApiClass[]): TeacherRow[] {
    const map = new Map<number | null, TeacherRow>();

    for (const c of list) {
      // ID & label
      const id = (c?.coursesTeacherFk ?? null) as number | null;
      const label =
        c?.teacherFullName ??
        c?.teacherCourseName ??
        (id !== null ? `معلم #${id}` : 'غير مخصّص');

      if (!map.has(id)) map.set(id, { teacherId: id, teacherLabel: String(label), blocks: [] });

      // Build a block for the row
      const start = this.toDate(c?.expectedStartTime);
      const end = this.toDate(c?.expectedEndTime) ?? start;
      const { colStart, colEnd } = this.toGridSpan(start, end);

      const block: Block = {
        col: `${colStart} / ${colEnd}`,
        title: c?.classTitle || c?.teacherCourseName || '—',
        time: this.formatTimeRange(start, end),
        status: c?.statusName || '—',
        statusClass: this.statusClass(c?.classStatusFk),
        classPk: c?.classPk
      };
      map.get(id)!.blocks.push(block);
    }

    // Optional: sort blocks in each row by start column
    for (const row of map.values()) {
      row.blocks.sort((a, b) => {
        const sA = Number(a.col.split('/')[0].trim());
        const sB = Number(b.col.split('/')[0].trim());
        return sA - sB;
      });
    }

    // Sort teachers alphabetically (Arabic)
    return Array.from(map.values()).sort((a, b) =>
      a.teacherLabel.localeCompare(b.teacherLabel, 'ar')
    );
  }

  private toDate(x: any): Date {
    return x ? new Date(x) : new Date();
  }

  private toGridSpan(start: Date, end: Date) {
    // clamp to schedule bounds
    const clamp = (d: Date) => {
      const cl = new Date(d);
      const s = new Date(d); s.setHours(this.START_HOUR, 0, 0, 0);
      const e = new Date(d); e.setHours(this.END_HOUR, 0, 0, 0);
      if (cl < s) cl.setTime(s.getTime());
      if (cl > e) cl.setTime(e.getTime());
      return cl;
    };
    const s = clamp(start);
    const e = clamp(end);

    const minutesFromStart = (d: Date) => (d.getHours() - this.START_HOUR) * 60 + d.getMinutes();
    const sMin = Math.max(0, minutesFromStart(s));
    const eMin = Math.max(sMin + this.SLOT_MIN, minutesFromStart(e)); // min 1 slot

    const colStart = Math.floor(sMin / this.SLOT_MIN) + 1;
    const colEnd = Math.ceil(eMin / this.SLOT_MIN) + 1;

    return { colStart, colEnd };
  }

  // private formatHour(h: number): string {
  //   const d = new Date(); d.setHours(h, 0, 0, 0);
  //   return new Intl.DateTimeFormat('ar-EG', { hour: '2-digit' }).format(d);
  // }

  // private formatTimeRange(s: Date, e: Date): string {
  //   const f = (d: Date) => new Intl.DateTimeFormat('ar-EG', { hour: '2-digit', minute: '2-digit' }).format(d);
  //   return `${f(s)} – ${f(e)}`;
  // }

  /** Robust hour label — prefers Intl, falls back to manual 24h for Arabic */
  private formatHour(h: number): string {
    const d = new Date(); d.setHours(h, 0, 0, 0);

    try {
      const useArabic = this.isArabic(this.langCode);
      const fmt = new Intl.DateTimeFormat(this.currentLocale, {
        hour: '2-digit',
        // hourCycle improves reliability vs hour12
        hourCycle: useArabic ? 'h23' : 'h12'
      });
      let out = fmt.format(d);
      // enforce latin digits in Arabic if engine ignored nu=latn
      if (useArabic) out = this.toLatinDigits(out);
      return out;
    } catch {
      // Safe fallback (especially for older WebViews)
      return this.manualHHmm(d);
    }
  }

  /** Robust time range */
  private formatTimeRange(s: Date, e: Date): string {
    try {
      const useArabic = this.isArabic(this.langCode);
      const fmt = new Intl.DateTimeFormat(this.currentLocale, {
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: useArabic ? 'h23' : 'h12'
      });
      let a = fmt.format(s);
      let b = fmt.format(e);
      if (useArabic) { a = this.toLatinDigits(a); b = this.toLatinDigits(b); }

      // keep the dash visually correct in RTL
      const LRM = '\u200E';
      return `${a} ${LRM}–${LRM} ${b}`;
    } catch {
      // Fallback 24h
      const a = this.manualHHmm(s);
      const b = this.manualHHmm(e);
      const LRM = '\u200E';
      return `${a} ${LRM}–${LRM} ${b}`;
    }
  }
  private statusClass(s?: number | null): string {
    switch (s) {
      case 64:
        return 'badge scheduled';
      case 65:
        return 'badge running';
      case 66:
        return 'badge done';
      case 67:
        return 'badge canceled';
      default:
        return 'badge';
    }
  }

  
openClass(classPk: number) {
  const ref = this.dialog.open(ClassDetailsFormComponent, {
    width: '900px',
    maxWidth: '95vw',
    data: { classId: classPk },
    autoFocus: false
  });

  ref.afterClosed().pipe(take(1)).subscribe((shouldReload: boolean) => {
    if (shouldReload) {
      this.sub?.unsubscribe();
      this.loadData();       
    }
  });
}

}
