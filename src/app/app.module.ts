import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PreloaderComponent } from './shared/preloader/preloader.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { BackToTopComponent } from './shared/back-to-top/back-to-top.component';
import { LoginComponent } from './Features/auth/components/login/login.component';

import { FormsModule } from '@angular/forms';
import { SliderComponent } from './Features/home/slider/slider.component';
import { ServicesComponent } from './Features/home/services/services.component';
import { CoursesComponent } from './Features/home/courses/courses.component';
import { AboutSection1Component } from './Features/home/about-section1/about-section1.component';
import { AboutSection2Component } from './Features/home/about-section2/about-section2.component';
import { AboutSection3Component } from './Features/home/about-section3/about-section3.component';
import { TopicsComponent } from './Features/home/topics/topics.component';
import { TeamComponent } from './Features/home/team/team.component';
import { HomeComponent } from './Features/home/home.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { TemplateComponent } from './shared/template/template.component';
import { CoursesPageComponent } from './Features/courses/components/courses-page.component';
import { MatPaginatorIntl, MatPaginatorModule , MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { GenericTableComponent } from './shared/components/table-components/generic-table/generic-table.component';
import { TableColumnComponent } from './shared/components/table-components/table-column/table-column.component';
import { MatIcon } from '@angular/material/icon';
import { AppButtonComponent } from './shared/components/app-button/app-button.component';
import { MatAccordion, MatExpansionModule , MatExpansionPanel } from '@angular/material/expansion';
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
import { MatNativeDateModule } from '@angular/material/core';
import { UsersComponent } from './Features/users/components/users.component';
import { SystemLookupsComponent } from './Features/system-lookups/components/system-lookups.component';
import { FinancialTransactionsPageComponent } from './Features/financial-transactions/components/financial-transactions-page/financial-transactions-page.component';
import { AuthInterceptor } from '../auth.interceptor';
// import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';




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
    ConfirmPopupComponent,
    DateTimePickerComponent,
    UsersComponent,
    SystemLookupsComponent,
    FinancialTransactionsPageComponent
    
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
   MatPaginatorModule ,
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
  //  NgxMatDatetimePickerModule,
    // NgxMatTimepickerModule,
    // NgxMatNativeDateModule

  ],
  providers: [
  { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl },
 {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
  ],  bootstrap: [AppComponent]
})
export class AppModule { }
