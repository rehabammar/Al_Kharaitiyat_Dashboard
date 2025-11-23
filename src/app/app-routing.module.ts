import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Features/auth/components/login/login.component';
import { TemplateComponent } from './shared/app-template/template/template.component';
import { AuthGuard } from './auth.guard';
import { CoursesPageComponent } from './Features/courses/components/courses-page.component';
import { UsersComponent } from './Features/users/components/users.component';
import { SystemLookupsComponent } from './Features/system-lookups/components/system-lookups.component';
import { FinancialTransactionsPageComponent } from './Features/financial-transactions/components/financial-transactions-page/financial-transactions-page.component';
import { ReportsFormComponent } from './Features/reports/components/reports-form/reports-form.component';
import { HomeComponent } from './Features/home/components/main-page/home.component';
import { PreLoginPageComponent } from './Features/pre-login/components/pre-login-page/pre-login-page.component';
import { OrganizationDetailsComponent } from './Features/organization/components/organization-details/organization-details.component';
import { PrivacyPolicyComponent } from './Features/pre-login/components/privacy-policy/privacy-policy.component';
import { DeleteAccountComponent } from './Features/pre-login/components/delete-account/delete-account.component';
import { TeachersTrackingComponent } from './Features/tracking/components/teachers-tracking/teachers-tracking.component';
import { PaymnetPageComponent } from './Features/payments/components/paymnet-page/paymnet-page.component';
import { CommunicationPageComponent } from './Features/communication/components/communication-page/communication-page.component';


const routes: Routes = [
  { path: '', redirectTo: '/MainPage', pathMatch: 'full' }, 
  { path: 'MainPage', component: PreLoginPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'privacy', component: PrivacyPolicyComponent },
  { path: 'deleteAccount', component: DeleteAccountComponent },

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
      { path: 'organization', component: OrganizationDetailsComponent },
      { path: 'teachersTracking', component: TeachersTrackingComponent },
      { path: 'payment', component: PaymnetPageComponent },
      { path: 'communication', component: CommunicationPageComponent },



      

      
      
    ]
    
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
