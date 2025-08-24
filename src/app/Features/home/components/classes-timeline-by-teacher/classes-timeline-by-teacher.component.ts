// classes-timeline-by-teacher.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HomeService } from '../../services/home.servics';
import { Class } from '../../../courses/models/class.model';

type TeacherGroup = {
  teacherId: number | null;
  teacherLabel: string;
  items: Class[];
};

@Component({
  selector: 'app-classes-timeline-by-teacher',
  standalone: false,
  templateUrl: './classes-timeline-by-teacher.component.html',
  styleUrls: ['./classes-timeline-by-teacher.component.css']
})
export class ClassesTimelineByTeacherComponent implements OnInit, OnDestroy {
  groups: TeacherGroup[] = [];
  loading = false;
  private sub?: Subscription;

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.loading = true;
    this.sub = this.homeService.getDailyClasses()
      .pipe(
        catchError(err => {
          console.error('getDailyClasses error:', err);
          this.groups = [];
          this.loading = false;
          return of([]); // empty list
        })
      )
      .subscribe(list => {
        const items = (list ?? []).map(this.mapToItem);
        this.buildGroups(items);
        this.loading = false;
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  /** Map API object -> ClassItem the timeline understands */
  private mapToItem = (c: any): Class => ({
    classPk: c?.classPk,
    classTitle: c?.classTitle ?? null,
    // teacherCourseName: c?.teacherName ?? null,          // use if API provides it
    teacherCourseName: c?.teacherCourseName ?? null,
    coursesTeacherFk: c?.coursesTeacherFk ?? null,
    statusName: c?.statusName ?? null,
    expectedStartTime: c?.expectedStartTime ?? null,
    expectedEndTime: c?.expectedEndTime ?? null
  });

  /** Build teacher groups and sort items by expectedStartTime */
  private buildGroups(items: Class[]): void {
    const map = new Map<number | null, TeacherGroup>();

    for (const c of items ?? []) {
      const id = c.coursesTeacherFk ?? null;
      const label =
        (c as any).teacherName ??
        c.teacherCourseName ??
        (id !== null ? `معلم #${id}` : 'غير مخصّص');

      if (!map.has(id)) {
        map.set(id, { teacherId: id, teacherLabel: String(label), items: [] });
      }
      map.get(id)!.items.push(c);
    }

    // Sort each teacher’s classes by start time
    for (const g of map.values()) {
      g.items.sort((a, b) =>
        new Date(a.expectedStartTime || 0).getTime() -
        new Date(b.expectedStartTime || 0).getTime()
      );
    }

    // Sort teachers alphabetically (Arabic)
    this.groups = Array.from(map.values()).sort((a, b) =>
      a.teacherLabel.localeCompare(b.teacherLabel, 'ar')
    );
  }

  formatTime(dt?: string | null): string {
    if (!dt) return '—';
    const d = new Date(dt);
    return new Intl.DateTimeFormat('ar-EG', {
      hour: '2-digit', minute: '2-digit'
    }).format(d);
  }

  statusClass(s?: string | null): string {
    switch (s?.trim()) {
      case 'مجدولة': return 'badge scheduled';
      case 'جارية':  return 'badge running';
      case 'انتهت':  return 'badge done';
      default:        return 'badge';
    }
  }
}
