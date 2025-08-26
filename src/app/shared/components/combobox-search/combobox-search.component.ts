import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SearchServiceFactory } from '../../../core/factories/search-service-factory';
import { SearchService } from '../../../core/services/shared/search.service';
import { Subject, takeUntil, take } from 'rxjs';

@Component({
  selector: 'app-combobox-search',
  standalone: false,
  templateUrl: './combobox-search.component.html',
  styleUrl: './combobox-search.component.css',
})
export class ComboboxSearchComponent<T extends Record<string, any>> implements OnInit, OnChanges, OnDestroy {

  @Input() apiPath!: string;
  @Input() dataFactory!: () => T;
  @Input() primaryKey!: keyof T;
  @Input() displayItemKey!: keyof T;

  @Input() set selectedKey(val: any) {
    this._selectedKey = val;
    this.tryApplySelection(); // بتشتغل تاني بعد وصول items في data$ كمان
  }
  get selectedKey() { return this._selectedKey; }

  @Input() hasError = false;

  @Output() itemSelected = new EventEmitter<T | null>();
  @Output() selectedKeyChange = new EventEmitter<any>();

  currentPage = 0;
  pageSize  = 10;

  items: T[] = [];
  selected: T | null | typeof this.MORE_OPTION = null;

  searchService!: SearchService<T>;
  private _selectedKey: any = null;
  private isLoading = false;

  private destroy$ = new Subject<void>();

  // كاش مشترك لكل instances بنفس الـ apiPath
  private static cache: Record<string, any[]> = {};
  // منع طلبات متكررة متوازية لنفس apiPath
  private static inflight: Record<string, boolean> = {};

  readonly MORE_OPTION = '__MORE_OPTION__' as const;

  constructor(
    private searchFactory: SearchServiceFactory,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  // ---------- Lifecycle ----------
  ngOnInit(): void {
    this.searchService = this.searchFactory.create<T>(this.apiPath);

    // اشتراك واحد فقط على data$
    this.searchService.data$
      .pipe(takeUntil(this.destroy$))
      .subscribe((list: T[]) => {
        if (Array.isArray(list)) {
          this.items = list;

          // اكتب في الكاش لأول مرة فقط
          if (!ComboboxSearchComponent.cache[this.apiPath]?.length && this.items.length) {
            ComboboxSearchComponent.cache[this.apiPath] = this.items;
          }

          this.tryApplySelection();
          this.cdr.markForCheck();
        }
      });

    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['apiPath'] && !changes['apiPath'].firstChange) {
      // لو المسار اتغير: امسح local state واشتغل من الكاش/السيرفس من جديد
      this.searchService = this.searchFactory.create<T>(this.apiPath);
      this.items = [];
      this.selected = null;
      this.loadData();
    }
    if (changes['selectedKey'] && !changes['selectedKey'].firstChange) {
      this.tryApplySelection();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ---------- UI handlers ----------
  onSelect(value: T | null | typeof this.MORE_OPTION) {
    if (value === this.MORE_OPTION) {
      this.openSearchDialog();
      this.selected = null;
      return;
    }

    this.selected = (value as T) ?? null;

    this.itemSelected.emit(this.selected);

    const pk = this.primaryKey as string;
    const key = this.selected ? (this.selected as any)[pk] : null;
    this._selectedKey = key;
    this.selectedKeyChange.emit(key);
  }

  // ---------- Data loading with cache ----------
  private loadData(): void {
    // 1) لو فيه كاش جاهز — استخدمه فورًا بدون call
    const cached = ComboboxSearchComponent.cache[this.apiPath] as T[] | undefined;
    if (cached?.length) {
      this.items = cached;
      this.tryApplySelection();
      this.cdr.markForCheck();
      return;
    }

    // 2) لو فيه طلب جاري لنفس apiPath — ما تطلبش تاني
    if (ComboboxSearchComponent.inflight[this.apiPath]) return;

    // 3) اطلب مرة واحدة
    ComboboxSearchComponent.inflight[this.apiPath] = true;
    this.isLoading = true;

    // مفيش nested subscribe هنا: getAll بتغذي data$ والاشتراك فوق بيحدّث items
    this.searchService.getAll(this.currentPage, this.pageSize)
      .pipe(take(1))
      .subscribe({
        complete: () => {
          this.isLoading = false;
          ComboboxSearchComponent.inflight[this.apiPath] = false;
        },
        error: () => {
          this.isLoading = false;
          ComboboxSearchComponent.inflight[this.apiPath] = false;
        }
      });
  }

  private tryApplySelection() {
    if (this._selectedKey == null) { this.selected = null; return; }
    if (!this.items?.length) return;

    const pk = this.primaryKey as string;
    const keyStr = String(this._selectedKey);
    const match = this.items.find(i => String((i as any)[pk]) === keyStr) ?? null;

    if (match) {
      this.selected = match;
      this.cdr.markForCheck();
      return;
    }

    // (اختياري) لو عندك getById في السيرفس، جيبه وحطه في items والكاش
    const svc: any = this.searchService as any;
    if (typeof svc.getById === 'function') {
      svc.getById(this._selectedKey)
        .pipe(takeUntil(this.destroy$))
        .subscribe((item: T | null) => {
          if (item) {
            this.items = [item, ...this.items];
            ComboboxSearchComponent.cache[this.apiPath] = this.items;
            this.selected = item;
            this.cdr.markForCheck();
          }
        });
    }
  }

  getDisplayText(item: T): string {
    const key = this.displayItemKey as string;
    return item ? String((item as any)[key] ?? '') : '';
  }

  openSearchDialog() {
    // ...
  }
}
