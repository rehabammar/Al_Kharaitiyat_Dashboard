import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PreloaderComponent } from './shared/app-template/preloader/preloader.component';
import { HeaderComponent } from './shared/app-template/header/header.component';
import { FooterComponent } from './shared/app-template/footer/footer.component';
import { BackToTopComponent } from './shared/app-template/back-to-top/back-to-top.component';
import { LoginComponent } from './Features/auth/components/login/login.component';

import { FormsModule } from '@angular/forms';
import { SliderComponent } from './Features/home/components/slider/slider.component';
import { ServicesComponent } from './Features/home/components/services/services.component';
import { CoursesComponent } from './Features/home/components/courses/courses.component';
import { AboutSection1Component } from './Features/home/components/about-section1/about-section1.component';
import { AboutSection2Component } from './Features/home/components/about-section2/about-section2.component';
import { AboutSection3Component } from './Features/home/components/about-section3/about-section3.component';
import { TopicsComponent } from './Features/home/components/topics/topics.component';
import { TeamComponent } from './Features/home/components/team/team.component';
import { HomeComponent } from './Features/home/components/main-page/home.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { TemplateComponent } from './shared/app-template/template/template.component';
import { CoursesPageComponent } from './Features/courses/components/courses-page.component';
import { MatPaginatorIntl, MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { GenericTableComponent } from './shared/components/table-components/generic-table/generic-table.component';
import { TableColumnComponent } from './shared/components/table-components/table-column/table-column.component';
import { MatIcon } from '@angular/material/icon';
import { AppButtonComponent } from './shared/components/app-button/app-button.component';
import { MatAccordion, MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { CustomAccordionComponent } from './shared/components/custom-accordion/custom-accordion.component';
import { GenericFormComponent } from './shared/components/generic-form/generic-form.component';
import { ComboboxSearchComponent } from './shared/components/combobox-search/combobox-search.component';
import { MatDialog, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { ConfirmPopupComponent } from './shared/components/confirm-popup/confirm-popup.component';
import { CustomPaginatorIntl } from './core/util/paginator-intl.service';
import { MatTabsModule } from '@angular/material/tabs';
import { DateTimePickerComponent } from './shared/components/date-time-picker/date-time-picker.component';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAT_DATE_FORMATS, MatNativeDateModule } from '@angular/material/core';
import { UsersComponent } from './Features/users/components/users.component';
import { SystemLookupsComponent } from './Features/system-lookups/components/system-lookups.component';
import { FinancialTransactionsPageComponent } from './Features/financial-transactions/components/financial-transactions-page/financial-transactions-page.component';
import { AuthInterceptor } from './auth.interceptor';
import { ReportsFormComponent } from './Features/reports/components/reports-form/reports-form.component';
import { LoadingSpinnerComponent } from './shared/app-template/loading-spinner/loading-spinner.component';
import { MonthlyFinancialTransactionsComponent } from './Features/home/components/monthly-financial-transactions/monthly-financial-transactions.component';
import { BaseChartDirective } from 'ng2-charts';
import { DailyClassSummaryComponent } from './Features/home/components/daily-class-summary/daily-class-summary.component';
import { ImageRotatorComponent } from './Features/home/components/image-rotator/image-rotator.component';
import { ClassesTimelineByTeacherComponent } from './Features/home/components/classes-timeline-by-teacher/classes-timeline-by-teacher.component';
import { PreLoginPageComponent } from './Features/pre-login/components/pre-login-page/pre-login-page.component';
import { PreLoginFooterComponent } from './Features/pre-login/components/pre-login-footer/pre-login-footer.component';
import { PreLoginHeaderComponent } from './Features/pre-login/components/pre-login-header/pre-login-header.component';
import { SearchDialogComponent } from './shared/components/search-dialog/search-dialog.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';
import { PayAllPopupComponent } from './Features/financial-transactions/components/pay-all-popup/pay-all-popup.component';
import { MY_DATE_FORMATS } from './core/util/matrial_date_formater';
import { OrganizationDetailsComponent } from './Features/organization/components/organization-details/organization-details.component';
import { ImageManagerComponent } from './shared/image-manager/image-manager.component';
import { AppLogoComponent } from './shared/app-template/app-logo/app-logo.component';
import { ClassDetailsFormComponent } from './Features/home/components/class-details-form/class-details-form.component';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';



@NgModule({
  declarations: [
    AppComponent,
    PreloaderComponent,
    HeaderComponent,
    FooterComponent,
    BackToTopComponent,
    SliderComponent,
    ServicesComponent,
    CoursesComponent,
    AboutSection1Component,
    AboutSection2Component,
    AboutSection3Component,
    TopicsComponent,
    TeamComponent,
    HomeComponent,
    LoginComponent,
    TemplateComponent,
    CoursesPageComponent,
    GenericTableComponent,
    TableColumnComponent,
    AppButtonComponent,
    CustomAccordionComponent,
    GenericFormComponent,
    ComboboxSearchComponent,
    SearchDialogComponent,
    ConfirmPopupComponent,
    DateTimePickerComponent,
    UsersComponent,
    SystemLookupsComponent,
    FinancialTransactionsPageComponent,
    ReportsFormComponent,
    LoadingSpinnerComponent,
    MonthlyFinancialTransactionsComponent,
    DailyClassSummaryComponent,
    ImageRotatorComponent,
    ClassesTimelineByTeacherComponent,
    PreLoginPageComponent,
    PreLoginFooterComponent,
    PreLoginHeaderComponent,
    PayAllPopupComponent,
    OrganizationDetailsComponent,
    ImageManagerComponent,
    AppLogoComponent,
    ClassDetailsFormComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    // MatDialog,
    TranslateModule.forRoot({
      loader: provideTranslateHttpLoader({
        prefix: '/assets/i18n/',
        suffix: '.json',
      }),
      fallbackLang: 'ar',
    }),
    HttpClientModule,
    MatPaginatorModule,
    MatPaginator,
    MatTableModule,
    MatIcon,
    MatAccordion,
    MatExpansionModule,
    MatExpansionPanel,
    MatDialogActions,
    MatDialogContent,
    MatTabsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    BaseChartDirective,
    MatProgressSpinnerModule


  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideMessaging(() => getMessaging()),

  ], bootstrap: [AppComponent]
})
export class AppModule { }
