import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartDataset, ChartOptions, Plugin, ScriptableContext } from 'chart.js';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { HomeService } from '../../services/home.servics';
import { MonthlyCollection } from '../../models/monthly-collection.model';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-monthly-financial-transactions',
  templateUrl: './monthly-financial-transactions.component.html',
  styleUrls: ['./monthly-financial-transactions.component.css']
})
export class MonthlyFinancialTransactionsComponent implements OnInit, OnDestroy {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  // ألوان ثابتة للسنتين
  private readonly YEAR_COLORS = {
    previous: { bg: 'rgba(34,197,94,0.35)', border: 'rgba(34,197,94,1)' },  // أخضر
    latest:   { bg: 'rgba(59,130,246,0.35)', border: 'rgba(59,130,246,1)' } // أزرق
  };

  // Plugins
  public barChartPlugins: Plugin<'bar'>[] = [DatalabelsPlugin];

  // ليبل الأشهر من ARB
  private monthLabels: string[] = [];

  // البيانات
  public barChartData: ChartData<'bar'> = {
    labels: this.monthLabels,
    datasets: [] as ChartDataset<'bar'>[]
  };

  // الخيارات
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2900,
      easing: 'easeOutQuart'
      // delay: (ctx) => (ctx.type === 'data' ? (ctx.dataIndex ?? 0) * 60 + (ctx.datasetIndex ?? 0) * 120 : 0)
    },
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { size: 16, weight: 'bold' },
          padding: 12,
          boxWidth: 14, boxHeight: 14
        }
      },
      title: { display: true, text: '', font: { size: 18, weight: 'bold', family: 'cairoFont' } },
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
      // bar3d & hoverLift options تُحقن في ngOnInit
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
  ) {}

  // ───────────── بلجن 3D (وجه جانبي + علوي) ─────────────
  readonly bar3dPlugin: Plugin<'bar'> = {
    id: 'bar3d',
    afterDatasetsDraw: (chart, _args, pluginOpts: any) => {
      const { ctx, chartArea } = chart;
      if (!chartArea) return;

      const depth   = Math.max(2, Math.min(12, pluginOpts?.depth ?? 6));
      const opacity = Math.max(0, Math.min(1,  pluginOpts?.opacity ?? 0.22));
      const drawTop = pluginOpts?.top !== false;

      chart.data.datasets.forEach((ds, di) => {
        const meta = chart.getDatasetMeta(di);
        meta.data.forEach((el: any) => {
          const { x, y, base, width } = el;
          const left   = x - width / 2;
          const right  = x + width / 2;
          const top    = y;
          const bottom = base;

          const faceColor = (typeof ds.borderColor === 'string')
            ? ds.borderColor
            : Array.isArray(ds.borderColor) ? String(ds.borderColor[0]) : 'rgba(0,0,0,1)';

          const sideFill = this.rgbaFrom(faceColor, opacity);

          ctx.save();

          // الوجه الأيمن
          ctx.beginPath();
          ctx.moveTo(right, top);
          ctx.lineTo(right + depth, top - depth);
          ctx.lineTo(right + depth, bottom - depth);
          ctx.lineTo(right, bottom);
          ctx.closePath();
          ctx.fillStyle = sideFill;
          ctx.fill();

          // الوجه العلوي (اختياري)
          if (drawTop) {
            ctx.beginPath();
            ctx.moveTo(left, top);
            ctx.lineTo(right, top);
            ctx.lineTo(right + depth, top - depth);
            ctx.lineTo(left + depth, top - depth);
            ctx.closePath();
            ctx.fillStyle = 'rgba(255,255,255,0.35)';
            ctx.fill();
          }

          ctx.restore();
        });
      });
    }
  };

  // ───────────── Helper لرسم مستطيل بحواف دائرية ─────────────
  private drawRoundRect(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number, r: number
  ){
    const rr = Math.min(r, Math.max(0, w/2), Math.max(0, h/2));
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.lineTo(x + w - rr, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
    ctx.lineTo(x + w, y + h - rr);
    ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
    ctx.lineTo(x + rr, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
    ctx.lineTo(x, y + rr);
    ctx.quadraticCurveTo(x, y, x + rr, y);
    ctx.closePath();
  }

  // ───────────── Plugin: رفع + شادو عند الـ hover ─────────────
  readonly barHoverLiftPlugin: Plugin<'bar'> = {
    id: 'barHoverLift',
    afterDatasetsDraw: (chart) => {
      const act = chart.getActiveElements?.() || [];
      if (!act.length) return;

      const { ctx } = chart;
      const lift = 4;       // مقدار الرفع
      const radius = 6;     // يطابق borderRadius للبار
      const shadowH = 6;    // ارتفاع الشادو

      act.forEach(({ datasetIndex, index }) => {
        const meta = chart.getDatasetMeta(datasetIndex);
        const el: any = meta.data[index];
        if (!el) return;

        const { x, y, base, width } = el;
        const left = x - width / 2;
        const top = y;
        const bottom = base;

        // شادو تحت العمود
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,.25)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 2;
        ctx.fillStyle = 'rgba(0,0,0,.18)';
        this.drawRoundRect(ctx, left, bottom - shadowH/2 + lift, width, shadowH, 4);
        ctx.fill();
        ctx.restore();

        // إعادة رسم العمود مرفوعًا سنة
        const ds = chart.data.datasets[datasetIndex] as any;
        const borderCol = (typeof ds.borderColor === 'string')
          ? ds.borderColor
          : Array.isArray(ds.borderColor) ? String(ds.borderColor[0]) : 'rgba(0,0,0,0.5)';

        ctx.save();
        ctx.translate(0, -lift);
        const grad = this.makeBarGradient({ chart } as any, borderCol) as CanvasGradient | string;
        ctx.fillStyle = grad;
        this.drawRoundRect(ctx, left, top, width, bottom - top, radius);
        ctx.fill();
        ctx.restore();
      });
    }
  };

  // ─────────────────────────────────────────────

  ngOnInit(): void {
    // فعّل البلجنز وخياراتها
    this.barChartPlugins.push(this.bar3dPlugin, this.barHoverLiftPlugin);
    (this.barChartOptions.plugins as any).bar3d = { depth: 6, opacity: 0.22, top: true };

    // ترجمات ابتدائية
    this.applyTranslations();

    // إعادة تطبيق الترجمات عند تغيير اللغة
    this.langSub = this.translate.onLangChange.subscribe((_e: LangChangeEvent) => {
      this.applyTranslations();
      this.chart?.update();
    });

    // تحميل البيانات
    this.loadData();
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }

  loadData(): void {
    this.homeService.getMonthlyfinancialTransactions().subscribe({
      next: (list) => this.applyData(list ?? []),
      error: () => this.applyData([])
    });
  }

  private applyData(list: MonthlyCollection[]) {
    const years = Array.from(new Set(list.map(d => d.yearNumber))).sort((a, b) => a - b);
    const yearToSeries = new Map<number, number[]>();

    // مصفوفات 12 شهر
    for (const y of years) yearToSeries.set(y, new Array(12).fill(0));
    for (const d of list) {
      const y = d.yearNumber;
      if (!yearToSeries.has(y)) yearToSeries.set(y, new Array(12).fill(0));
      const arr = yearToSeries.get(y)!;
      const idx = Math.max(1, Math.min(12, d.monthNumber)) - 1;
      arr[idx] = (arr[idx] ?? 0) + (d.collectedAmount ?? 0);
    }

    const latest = years[years.length - 1];

    const datasets: ChartDataset<'bar'>[] = years.map((y) => {
      const c = (y === latest) ? this.YEAR_COLORS.latest : this.YEAR_COLORS.previous;
      return {
        label: String(y),
        data: yearToSeries.get(y)!,
        backgroundColor: (ctx) => this.makeBarGradient(ctx, c.border),
        borderColor: c.border,
        borderWidth: 1,
        borderSkipped: 'bottom',
        borderRadius: 6,
        barPercentage: 0.8,
        categoryPercentage: 0.7
      };
    });

    this.barChartData = {
      labels: this.monthLabels,
      datasets
    };

    // سقف المحور Y المقترَح = أقصى قيمة * 1.2
    const flat = Array.from(yearToSeries.values()).flat();
    const maxVal = Math.max(0, ...flat.map(Number).filter(n => Number.isFinite(n)));
    const padFactor = 1.20;
    const ySuggestedMax = maxVal === 0 ? 100 : Math.ceil((maxVal * padFactor) / 100) * 100;

    const scales = (this.barChartOptions.scales ??= {});
    (scales['y'] ??= {} as any);
    (scales['y'] as any).beginAtZero = true;
    (scales['y'] as any).suggestedMax = ySuggestedMax;

    this.chart?.update();
  }

  /** تحميل ترجمات التيتل والمحاور وأسماء الشهور */
  private applyTranslations(): void {
    const keys = [
      'Charts.CollectedByMonth',
      'Charts.Month',
      'Charts.CollectedAmount',
      'Months.Full'
    ];

    this.translate.get(keys).subscribe(t => {
      const months = t['Months.Full'];
      this.monthLabels = Array.isArray(months) && months.length === 12
        ? months
        : this.buildIntlMonthNames(this.translate.currentLang || 'ar-EG', 'long');

      const tTitle = t['Charts.CollectedByMonth'] || 'Collected Amount by Month';
      const tX = t['Charts.Month'] || 'Month';
      const tY = t['Charts.CollectedAmount'] || 'Collected Amount';

      (this.barChartOptions as any).locale = this.translate.currentLang || 'ar-EG';

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

      this.barChartData.labels = this.monthLabels;
      this.chart?.update();
    });
  }

  private buildIntlMonthNames(lang: string, width: 'short' | 'long' = 'long'): string[] {
    const locale = lang || 'ar-EG';
    return Array.from({ length: 12 }, (_, i) =>
      new Date(2024, i, 1).toLocaleDateString(locale, { month: width })
    );
  }

  private formatNumber(v: unknown): string {
    const num = Number(v ?? 0);
    const lang = 'en';
    return new Intl.NumberFormat(lang).format(num);
  }

  // ───────────── Helpers للـ Gradient والـ rgba ─────────────
  private rgbaFrom(base: string, a: number): string {
    if (base.startsWith('rgba') || base.startsWith('rgb')) {
      return base.replace(/rgba?\(([^)]+)\)/, (_m, inner: string) => {
        const p: string[] = inner.split(',').map((s: string) => s.trim());
        const [r, g, b] = [p[0], p[1], p[2]];
        return `rgba(${r},${g},${b},${a})`;
      });
    }
    // hex (#RGB أو #RRGGBB)
    const hex = base.replace('#','');
    const h = hex.length === 3
      ? hex.split('').map(c => c + c).join('')
      : hex.padEnd(6,'0');
    const r = parseInt(h.slice(0,2),16);
    const g = parseInt(h.slice(2,4),16);
    const b = parseInt(h.slice(4,6),16);
    return `rgba(${r},${g},${b},${a})`;
  }

  private makeBarGradient(ctx: ScriptableContext<'bar'>, baseBorder: string): CanvasGradient | string {
    const chart = ctx.chart;
    const chartArea = chart?.chartArea;
    if (!chartArea) return this.rgbaFrom(baseBorder, 0.6);

    const g = chart.ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    // فاتح أعلى → أغمق أسفل
    g.addColorStop(0.00, this.rgbaFrom(baseBorder, 0.90));
    g.addColorStop(0.55, this.rgbaFrom(baseBorder, 0.55));
    g.addColorStop(1.00, this.rgbaFrom('#000', 0.08));
    return g;
  }
}