import { Component, ViewChild } from '@angular/core';
import { MonthlyFinancialTransactionsComponent } from '../monthly-financial-transactions/monthly-financial-transactions.component';
import { DailyClassSummary } from '../../models/daily-class-summary.model';
import { ClassesTimelineByTeacherComponent } from '../classes-timeline-by-teacher/classes-timeline-by-teacher.component';
import { Subscription } from 'rxjs';
import { MessagingBridgeService } from '../../../../core/services/shared/messaging-bridge.service';
import { DailyClassSummaryComponent } from '../daily-class-summary/daily-class-summary.component';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  @ViewChild('monthlyFinancialTransactions') monthlyFinancialTransactions!: MonthlyFinancialTransactionsComponent;
  @ViewChild('dailyClassSummary') dailyClassSummary!: DailyClassSummaryComponent;
  @ViewChild('classesTimeline') classesTimeline!: ClassesTimelineByTeacherComponent;

   private sub?: Subscription;

  constructor(private bridge: MessagingBridgeService) {}

  ngAfterViewInit(): void {
    this.sub = this.bridge.events$.subscribe(e => {
      if (e?.type === 'REFRESH') {
        this.monthlyFinancialTransactions?.loadData?.();
        this.dailyClassSummary?.loadDate?.();
        this.classesTimeline?.loadData?.();
      }
    });
  }

  ngOnDestroy(): void { this.sub?.unsubscribe(); }



}
