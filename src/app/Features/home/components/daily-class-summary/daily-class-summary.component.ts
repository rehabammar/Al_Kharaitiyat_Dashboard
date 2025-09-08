import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { DailyClassSummary } from '../../models/daily-class-summary.model';
import { HomeService } from '../../services/home.servics';
import { Subscription, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'app-daily-class-summary',
  standalone: false,
  templateUrl: './daily-class-summary.component.html',
  styleUrls: ['./daily-class-summary.component.css'],
})
export class DailyClassSummaryComponent implements OnInit, OnDestroy {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  private sub?: Subscription;
  private langSub?: Subscription;

  piePlugins = [DatalabelsPlugin];

  pieData: ChartData<'pie', number[], string> = {
    labels: ['Finished', 'Remaining'], // will be replaced by translations at runtime
    datasets: [{
      data: [0, 0],
      backgroundColor: [ '#b2ebc7','#bbd3fc'],
      borderWidth: 0
    }]
  };

  pieOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
      animation: {
    duration: 2200,             // 👈 كبّر المدة (جرب 2000–3000ms)
    easing: 'easeOutQuart', 
  },
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
       title: { display: true, text: '' }, // set from ARB
      datalabels: {
        color: '#000',
        font: { weight: 'bold' },
        formatter: (value: unknown, ctx) => {
          const data = (ctx.dataset.data as Array<number | null | undefined>) ?? [];
          const idx = ctx.dataIndex ?? 0;
          const val = Number(data[idx] ?? value ?? 0);
          if (!val) return '';
          const total = data.reduce<number>((acc, n) => acc + (n ?? 0), 0);
          const pct = total ? Math.round((val / total) * 100) : 0;
          return `${val} (${pct}%)`;
        }
      },
      tooltip: {
        callbacks: {
          label: (c) => {
            const v = Number(c.parsed) || 0;
            const data = (c.dataset.data as number[]).map(n => Number(n) || 0);
            const total = data.reduce((a, b) => a + b, 0);
            const pct = total ? Math.round((v / total) * 100) : 0;
            return ` ${c.label}: ${v.toLocaleString('en-US')} (${pct}%)`;
          }
        }
      }
    }
  };

  constructor(private homeService: HomeService, private translate: TranslateService) { }

  ngOnInit(): void {
    // load i18n labels initially
    this.applyTranslations();

    // update labels when language changes
    this.langSub = this.translate.onLangChange.subscribe((_e: LangChangeEvent) => {
      this.applyTranslations();
    });

   this.loadDate();
  }

  loadDate(){
 // fetch data from API
    this.sub = this.homeService.getDailyClassSummary()
      .pipe(
        catchError(err => {
          return of({ finishedToday: 0, remainingToday: 0, totalToday: 0 } as DailyClassSummary);
        })
      )
      .subscribe(summary => this.updateChart(summary));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.langSub?.unsubscribe();
  }

  /** pull labels/title from ARB and refresh chart */
  private applyTranslations(): void {
    this.translate.get([
      'Class.Finished',
      'Class.Remaining',
      'Charts.TodaysClasses'
    ]).subscribe(t => {
      const labels = [
        t['Class.Finished'] || 'Finished',
        t['Class.Remaining'] || 'Remaining'
      ];
      // update labels + title
      this.pieData = { ...this.pieData, labels };
      if (this.pieOptions.plugins?.title) {
        this.pieOptions.plugins.title.text = t['Charts.TodaysClasses'] || "Today's Classes";
      }
      this.chart?.update();
    });
  }

  private updateChart(s: DailyClassSummary): void {
    const finished = Number(s?.finishedToday ?? 0);
    const total = Number(s?.totalToday ?? 0);
    const remaining = total > 0 ? Math.max(0, total - finished) : Number(s?.remainingToday ?? 0);

    const ds0 = this.pieData.datasets[0];
    this.pieData = {
      labels: this.pieData.labels,
      datasets: [{ ...ds0, data: [finished, remaining] }]
    };
    this.chart?.update();
  }
}
