import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Features/auth/components/login/login.component';
import { TemplateComponent } from './shared/template/template.component';
import { AuthGuard } from './auth.guard';
import { CoursesPageComponent } from './Features/courses/components/courses-page.component';
import { UsersComponent } from './Features/users/components/users.component';
import { SystemLookupsComponent } from './Features/system-lookups/components/system-lookups.component';
import { FinancialTransactionsPageComponent } from './Features/financial-transactions/components/financial-transactions-page/financial-transactions-page.component';
import { ReportsFormComponent } from './Features/reports/components/reports-form/reports-form.component';
import { HomeComponent } from './Features/home/components/main-page/home.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
    {
    path: '',
    component: TemplateComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'homePage', component: HomeComponent },
      { path: 'courses', component: CoursesPageComponent },
      { path: 'users', component: UsersComponent },
      { path: 'system-lookups', component: SystemLookupsComponent },
      { path: 'financial-transactions', component: FinancialTransactionsPageComponent },
      { path: 'reports', component: ReportsFormComponent },


      

      
      
    ]
    
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
