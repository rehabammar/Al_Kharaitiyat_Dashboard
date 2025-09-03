
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HomeService } from '../../services/home.servics';

type ApiClass = any; // use your real type if you have it
type Block = {
  col: string;             // CSS grid-column: "start / end"
  title: string;
  time: string;
  status: string;
  statusClass: string;
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

  // ---- grid config ----
  START_HOUR = 10;       // 07:00
  END_HOUR = 25;      // 10:00 PM
  SLOT_MIN = 10;      // slot granularity (10-minute steps like your data)

  cols = 0;             // total grid columns
  hourLabels: HourLabel[] = [];
  rows: TeacherRow[] = [];
  loading = false;

  constructor(private homeService: HomeService) { }

  ngOnInit(): void {
    this.buildHeader();
    this.loadData();
  }

  loadData() {

    this.loading = true;
    this.sub = this.homeService.getDailyClasses()
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

  ngOnDestroy(): void { this.sub?.unsubscribe(); }

  // ---------- helpers ----------
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
        statusClass: this.statusClass(c?.statusName)
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

  private formatHour(h: number): string {
    const d = new Date(); d.setHours(h, 0, 0, 0);
    return new Intl.DateTimeFormat('ar-EG', { hour: '2-digit' }).format(d);
  }

  private formatTimeRange(s: Date, e: Date): string {
    const f = (d: Date) => new Intl.DateTimeFormat('ar-EG', { hour: '2-digit', minute: '2-digit' }).format(d);
    return `${f(s)} – ${f(e)}`;
  }

  private statusClass(s?: string | null): string {
    switch ((s || '').trim()) {
      case 'مجدولة': return 'badge scheduled';
      case 'بدأت': return 'badge running';
      case 'انتهت': return 'badge done';
      case 'الغيت': return 'badge canceled';
      default: return 'badge';
    }
  }
}
