import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartDataset, ChartOptions } from 'chart.js';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { HomeService } from '../../services/home.servics';
import { MonthlyCollection } from '../../models/monthly-collection.model';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-monthly-financial-transactions',
  templateUrl: './monthly-financial-transactions.component.html',
  styleUrls: ['./monthly-financial-transactions.component.css']   // ← fixed
})
export class MonthlyFinancialTransactionsComponent implements OnInit, OnDestroy {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  // fixed colors for your two years
  private readonly YEAR_COLORS = {
    previous: { bg: 'rgba(34,197,94,0.35)', border: 'rgba(34,197,94,1)' },  // green
    latest: { bg: 'rgba(59,130,246,0.35)', border: 'rgba(59,130,246,1)' } // blue
  };


  // chartjs-plugin-datalabels
  public barChartPlugins = [DatalabelsPlugin];

  // month labels come from ARB at runtime
  private monthLabels: string[] = [];

  // data shell
  public barChartData: ChartData<'bar'> = {
    labels: this.monthLabels,
    datasets: [] as ChartDataset<'bar'>[]
  };

  // options shell (texts filled from ARB in applyTranslations)
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { size: 16, weight: 'bold' }, // ← legend font size
          padding: 12,                       // space around each item
          boxWidth: 14, boxHeight: 14        // size of color box
          // usePointStyle: true, pointStyle: 'circle', // optional nicer markers
        }
      },
      title: { display: true, text: '' },
      datalabels: {
        anchor: 'end',
        align: 'top',
        offset: 2,
        formatter: (v: unknown) => this.formatNumber(v),
        clip: true
      },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: ${this.formatNumber(ctx.parsed.y)}`
        }
      }
    },
    scales: {
      x: { title: { display: true, text: '' } },
      y: {
        beginAtZero: true,
        title: { display: true, text: '' },
        ticks: { callback: (v: any) => this.formatNumber(v) }
      }
    }
  };

  private langSub?: Subscription;

  constructor(
    private homeService: HomeService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    // 1) apply ARB labels now
    this.applyTranslations();

    // 2) re-apply when language changes
    this.langSub = this.translate.onLangChange.subscribe((_e: LangChangeEvent) => {
      this.applyTranslations();
      this.chart?.update();
    });

    // 3) load data
    this.loadData();
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }

  private loadData(): void {
    this.homeService.getMonthlyfinancialTransactions().subscribe({
      next: (list) => this.applyData(list ?? []),
      error: () => this.applyData([])
    });
  }

 private applyData(list: MonthlyCollection[]) {
  const years = Array.from(new Set(list.map(d => d.yearNumber))).sort((a, b) => a - b);
  const yearToSeries = new Map<number, number[]>();

  // build 12-month arrays
  for (const y of years) yearToSeries.set(y, new Array(12).fill(0));
  for (const d of list) {
    const y = d.yearNumber;
    if (!yearToSeries.has(y)) yearToSeries.set(y, new Array(12).fill(0));
    const arr = yearToSeries.get(y)!;
    const idx = Math.max(1, Math.min(12, d.monthNumber)) - 1;
    arr[idx] = (arr[idx] ?? 0) + (d.collectedAmount ?? 0);
  }

  // pick colors: latest year = green, previous = blue
  const latest = years[years.length - 1];
  const datasets: ChartDataset<'bar'>[] = years.map((y) => {
    const c = (y === latest) ? this.YEAR_COLORS.latest : this.YEAR_COLORS.previous;
    return {
      label: String(y),
      data: yearToSeries.get(y)!,
      backgroundColor: c.bg,
      borderColor: c.border,
      borderWidth: 1,
    };
  });

  this.barChartData = {
    labels: this.monthLabels,
    datasets
  };

  this.chart?.update();
}


  /** read month names + chart texts from ARB, fallback to Intl */
  private applyTranslations(): void {
    const keys = [
      'Charts.CollectedByMonth',
      'Charts.Month',
      'Charts.CollectedAmount',
      'Months.Full' // full month names array
    ];

    this.translate.get(keys).subscribe(t => {
      // month labels (prefer ARB array, fallback to Intl)
      const months = t['Months.Full'];
      this.monthLabels = Array.isArray(months) && months.length === 12
        ? months
        : this.buildIntlMonthNames(this.translate.currentLang || 'ar-EG', 'long');

      const tTitle = t['Charts.CollectedByMonth'] || 'Collected Amount by Month';
      const tX = t['Charts.Month'] || 'Month';
      const tY = t['Charts.CollectedAmount'] || 'Collected Amount';

      // set locale for tooltips/ticks
      (this.barChartOptions as any).locale = this.translate.currentLang || 'ar-EG';

      // ⚠️ scales has an index signature; use bracket syntax
      const scales = (this.barChartOptions.scales ??= {});
      (scales['x'] ??= { title: { display: true, text: '' } } as any);
      (scales['y'] ??= { title: { display: true, text: '' } } as any);

      if (this.barChartOptions.plugins?.title) {
        this.barChartOptions.plugins.title.text = tTitle;
      }
      (scales['x'] as any).title.text = tX;
      (scales['y'] as any).title.text = tY;

      (scales['x'] as any).ticks = { autoSkip: true, maxRotation: 0, minRotation: 0 };
      (scales['y'] as any).ticks = { callback: (v: any) => this.formatNumber(v) };

      // const scales = (this.barChartOptions.scales ??= {});
      // (scales['x'] ??= {} as any);
      // (scales['y'] ??= {} as any);

      // // 🔻 hide grid lines + ticks + axis border
      // (scales['x'] as any).grid = { display: false, drawBorder: false, drawTicks: false };
      // (scales['y'] as any).grid = { display: false, drawBorder: false, drawTicks: false };
      // (scales['x'] as any).border = { display: true }; // Chart.js v4 border
      // (scales['y'] as any).border = { display: true };

      // push labels into chart data and refresh
      this.barChartData.labels = this.monthLabels;
      this.chart?.update();
    });
  }

  private buildIntlMonthNames(lang: string, width: 'short' | 'long' = 'long'): string[] {
    const locale = lang || 'ar-EG';
    return Array.from({ length: 12 }, (_, i) =>
      new Date(2024, i, 1).toLocaleDateString(locale, { month: width })
    );
    // e.g., 'يناير'...'ديسمبر' for ar-EG when width='long'
  }

  private formatNumber(v: unknown): string {
    const num = Number(v ?? 0);
    const lang = 'en';
    return new Intl.NumberFormat(lang).format(num);
  }

  private color(i: number, alpha = 1): string {
    const hue = (i * 67) % 360;
    return `hsla(${hue} 70% 45% / ${alpha})`;
  }
}
