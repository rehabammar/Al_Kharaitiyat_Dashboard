// import {
//   ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges
// } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
// import { Subject, take, takeUntil } from 'rxjs';

// import { SearchServiceFactory } from '../../../core/factories/search-service-factory';
// import { SearchService } from '../../../core/services/shared/search.service';

// @Component({
//   selector: 'app-combobox-search',
//   standalone: false,
//   templateUrl: './combobox-search.component.html',
//   styleUrl: './combobox-search.component.css',
// })
// export class ComboboxSearchComponent<T extends Record<string, any>>
//   implements OnInit, OnChanges, OnDestroy {

//   @Input() apiPath!: string;
//   @Input() dataFactory!: () => T;
//   @Input() primaryKey!: keyof T;
//   @Input() displayItemKey!: keyof T;

//   /** Parent can pass any dependency filters here, e.g. { stageFk: 1 } */
//   @Input() params: Record<string, any> = {};

//   /** Two-way-ish: selected key (FK). */
//   @Input() set selectedKey(val: any) {
//     this._selectedKey = val;
//     this.tryApplySelection();
//   }
//   get selectedKey() { return this._selectedKey; }

//   @Input() hasError = false;

//   @Output() itemSelected = new EventEmitter<T | null>();
//   @Output() selectedKeyChange = new EventEmitter<any>();

//   currentPage = 0;
//   pageSize = 100;

//   items: T[] = [];
//   selected: T | null | typeof this.MORE_OPTION = null;

//   private searchService!: SearchService<T>;
//   private _selectedKey: any = null;
//   private destroy$ = new Subject<void>();
//   private isLoading = false;

//   /** Cache & inflight keyed by apiPath+params */
//   private static cache: Record<string, any[]> = {};
//   private static inflight: Record<string, boolean> = {};

//   readonly MORE_OPTION = '__MORE_OPTION__' as const;

//   constructor(
//     private searchFactory: SearchServiceFactory,
//     private dialog: MatDialog,
//     private cdr: ChangeDetectorRef
//   ) {}

//   // ---------- lifecycle ----------
//   ngOnInit(): void {
//     this.searchService = this.searchFactory.create<T>(this.apiPath);

//     // single subscription to service stream
//     this.searchService.data$
//       .pipe(takeUntil(this.destroy$))
//       .subscribe((list: T[]) => {
//         if (!Array.isArray(list)) return;
//         this.items = list;

//         // write to cache under current key
//         const key = this.cacheKey();
//         if (!ComboboxSearchComponent.cache[key]?.length && list.length) {
//           ComboboxSearchComponent.cache[key] = list;
//         }

//         this.tryApplySelection();
//         this.cdr.markForCheck();
//       });

//     this.loadData();
//   }

//   ngOnChanges(ch: SimpleChanges): void {
//     // apiPath changed → rebuild service and reload
//     if (ch['apiPath'] && !ch['apiPath'].firstChange) {
//       this.searchService = this.searchFactory.create<T>(this.apiPath);
//       this.items = [];
//       this.selected = null;
//       this.loadData();
//     }

//     // params changed (e.g., parent FK) → clear list & reload with new filters
//     if (ch['params'] && !ch['params'].firstChange) {
//       this.items = [];
//       this.selected = null;
//       this.loadData();
//     }

//     // external selection changed → try to reflect it
//     if (ch['selectedKey'] && !ch['selectedKey'].firstChange) {
//       this.tryApplySelection();
//     }
//   }

//   ngOnDestroy(): void {
//     this.destroy$.next();
//     this.destroy$.complete();
//   }

//   // ---------- UI ----------
//   onSelect(value: T | null | typeof this.MORE_OPTION) {
//     if (value === this.MORE_OPTION) {
//       this.openSearchDialog();
//       this.selected = null;
//       return;
//     }
//     this.selected = (value as T) ?? null;
//     this.itemSelected.emit(this.selected);

//     const pk = this.primaryKey as string;
//     const key = this.selected ? (this.selected as any)[pk] : null;
//     this._selectedKey = key;
//     this.selectedKeyChange.emit(key);
//   }

//   // ---------- data loading with per-params cache ----------
//   private loadData(): void {
//     const key = this.cacheKey();

//     // 1) serve cached
//     const cached = ComboboxSearchComponent.cache[key] as T[] | undefined;
//     if (cached?.length) {
//       this.items = cached;
//       this.tryApplySelection();
//       this.cdr.markForCheck();
//       return;
//     }

//     // 2) avoid duplicate in-flight calls
//     if (ComboboxSearchComponent.inflight[key]) return;

//     // 3) fetch once
//     ComboboxSearchComponent.inflight[key] = true;
//     this.isLoading = true;

//     const body = {
//       page: this.currentPage,
//       size: this.pageSize,
//       ...(this.params || {}),
//     };

//     this.searchService
//       .getAll(this.currentPage, this.pageSize, undefined, body)
//       .pipe(take(1))
//       .subscribe({
//         complete: () => {
//           this.isLoading = false;
//           ComboboxSearchComponent.inflight[key] = false;
//         },
//         error: () => {
//           this.isLoading = false;
//           ComboboxSearchComponent.inflight[key] = false;
//         },
//       });
//   }

//   private tryApplySelection() {
//     if (this._selectedKey == null) { this.selected = null; return; }
//     if (!this.items?.length) return;

//     const pk = this.primaryKey as string;
//     const keyStr = String(this._selectedKey);
//     const match = this.items.find(i => String((i as any)[pk]) === keyStr) ?? null;

//     if (match) {
//       this.selected = match;
//       this.cdr.markForCheck();
//       return;
//     }

//     // optional: fetch by id if service supports it
//     const svc: any = this.searchService as any;
//     if (typeof svc.getById === 'function') {
//       svc.getById(this._selectedKey)
//         .pipe(takeUntil(this.destroy$))
//         .subscribe((item: T | null) => {
//           if (!item) return;
//           this.items = [item, ...this.items];
//           ComboboxSearchComponent.cache[this.cacheKey()] = this.items;
//           this.selected = item;
//           this.cdr.markForCheck();
//         });
//     }
//   }

//   private cacheKey(): string {
//     // stable key: apiPath + normalized params
//     return `${this.apiPath}|${JSON.stringify(this.params ?? {})}`;
//   }

//   getDisplayText(item: T): string {
//     const key = this.displayItemKey as string;
//     return item ? String((item as any)[key] ?? '') : '';
//   }

//   openSearchDialog() {
//     // implement dialog if you need a “More…” popup
//   }
// }


import {
  ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, take, takeUntil } from 'rxjs';

import { SearchServiceFactory } from '../../../core/factories/search-service-factory';
import { SearchService } from '../../../core/services/shared/search.service';

@Component({
  selector: 'app-combobox-search',
  standalone: false,
  templateUrl: './combobox-search.component.html',
  styleUrl: './combobox-search.component.css', // (Angular prefers styleUrls: ['...'], but left as-is per your "stable")
})
export class ComboboxSearchComponent<T extends Record<string, any>>
  implements OnInit, OnChanges, OnDestroy {

  @Input() apiPath!: string;
  @Input() dataFactory!: () => T;
  @Input() primaryKey!: keyof T;
  @Input() displayItemKey!: keyof T;

  /** Parent can pass any dependency filters here, e.g. { stageFk: 1 } */
  @Input() params: Record<string, any> = {};

  /** Two-way-ish: selected key (FK). */
  @Input() set selectedKey(val: any) {
    this._selectedKey = val;
    this.tryApplySelection();
  }
  get selectedKey() { return this._selectedKey; }

  @Input() hasError = false;

  /** Boolean Force Update */
  @Input() forceUpdate = false;

  @Output() itemSelected = new EventEmitter<T | null>();
  @Output() selectedKeyChange = new EventEmitter<any>();

  currentPage = 0;
  pageSize = 100;

  items: T[] = [];
  selected: T | null | typeof this.MORE_OPTION = null;

  private searchService!: SearchService<T>;
  private _selectedKey: any = null;
  private destroy$ = new Subject<void>();
  private isLoading = false;

  /** Defer force update if it arrives before ngOnInit initializes the service */
  private _pendingForce = false;
  private _inited = false;

  /** Cache & inflight keyed by apiPath+params */
  private static cache: Record<string, any[]> = {};
  private static inflight: Record<string, boolean> = {};

  readonly MORE_OPTION = '__MORE_OPTION__' as const;

  constructor(
    private searchFactory: SearchServiceFactory,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  // ---------- lifecycle ----------
  ngOnInit(): void {
    this.searchService = this.searchFactory.create<T>(this.apiPath);

    // single subscription to service stream
    this.searchService.data$
      .pipe(takeUntil(this.destroy$))
      .subscribe((list: T[]) => {
        if (!Array.isArray(list)) return;
        this.items = list;

        // write to cache under current key (kept as-is from your stable version)
        const key = this.cacheKey();
        if (!ComboboxSearchComponent.cache[key]?.length && list.length) {
          ComboboxSearchComponent.cache[key] = list;
        }

        this.tryApplySelection();
        this.cdr.markForCheck();
      });

    this._inited = true;

    // If a force flag came before init, handle it now
    if (this._pendingForce || this.forceUpdate === true) {
      this._pendingForce = false;
      this.clearCacheForCurrentKey();
      this.items = [];
      this.selected = null;
      this.loadData();
    } else {
      this.loadData();
    }
  }

  ngOnChanges(ch: SimpleChanges): void {
    // apiPath changed → rebuild service and reload (after init)
    if (ch['apiPath'] && !ch['apiPath'].firstChange) {
      if (!this.searchService) return; // safety
      this.searchService = this.searchFactory.create<T>(this.apiPath);
      this.items = [];
      this.selected = null;
      this.loadData();
    }

    // params changed (e.g., parent FK) → clear list & reload with new filters
    if (ch['params'] && !ch['params'].firstChange) {
      if (!this.searchService) return; // safety
      this.items = [];
      this.selected = null;
      this.loadData();
    }

    // ✅ Boolean force update
    if (ch['forceUpdate'] && ch['forceUpdate'].currentValue === true) {
      // If not yet inited, defer the force until ngOnInit
      if (!this._inited || !this.searchService) {
        this._pendingForce = true;
      } else {
        this.clearCacheForCurrentKey();
        this.items = [];
        this.selected = null;
        this.loadData();
      }
      // (Parent should toggle forceUpdate back to false)
    }

    // external selection changed → try to reflect it
    if (ch['selectedKey'] && !ch['selectedKey'].firstChange) {
      this.tryApplySelection();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ---------- UI ----------
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

  // ---------- data loading with per-params cache ----------
  private loadData(): void {
    const key = this.cacheKey();

    // 1) serve cached
    const cached = ComboboxSearchComponent.cache[key] as T[] | undefined;
    if (cached?.length) {
      this.items = cached;
      this.tryApplySelection();
      this.cdr.markForCheck();
      return;
    }

    // 2) avoid duplicate in-flight calls
    if (ComboboxSearchComponent.inflight[key]) return;

    // 3) fetch once
    ComboboxSearchComponent.inflight[key] = true;
    this.isLoading = true;

    const body = {
      page: this.currentPage,
      size: this.pageSize,
      ...(this.params || {}),
    };

    // guard: searchService should exist here
    if (!this.searchService) {
      // reset inflight to avoid blocking future loads
      ComboboxSearchComponent.inflight[key] = false;
      return;
    }

    this.searchService
      .getAll(this.currentPage, this.pageSize, undefined, body)
      .pipe(take(1))
      .subscribe({
        complete: () => {
          this.isLoading = false;
          ComboboxSearchComponent.inflight[key] = false;
        },
        error: () => {
          this.isLoading = false;
          ComboboxSearchComponent.inflight[key] = false;
        },
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

    // optional: fetch by id if service supports it
    const svc: any = this.searchService as any;
    if (svc && typeof svc.getById === 'function') {
      svc.getById(this._selectedKey)
        .pipe(takeUntil(this.destroy$))
        .subscribe((item: T | null) => {
          if (!item) return;
          this.items = [item, ...this.items];
          ComboboxSearchComponent.cache[this.cacheKey()] = this.items;
          this.selected = item;
          this.cdr.markForCheck();
        });
    }
  }

  private cacheKey(): string {
    // stable key: apiPath + normalized params
    return `${this.apiPath}|${JSON.stringify(this.params ?? {})}`;
  }

  private clearCacheForCurrentKey(): void {
    const key = this.cacheKey();
    delete ComboboxSearchComponent.cache[key];
    delete ComboboxSearchComponent.inflight[key];
  }

  getDisplayText(item: T): string {
    const key = this.displayItemKey as string;
    return item ? String((item as any)[key] ?? '') : '';
  }

  openSearchDialog() {
    // implement dialog if you need a “More…” popup
  }
}
