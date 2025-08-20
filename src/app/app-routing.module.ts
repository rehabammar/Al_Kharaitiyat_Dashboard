import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Features/home/home.component';
import { LoginComponent } from './Features/auth/components/login/login.component';
import { TemplateComponent } from './shared/template/template.component';
import { AuthGuard } from '../../auth.guard';
import { CoursesPageComponent } from './Features/courses/components/courses-page.component';
import { UsersComponent } from './Features/users/components/users.component';
import { SystemLookupsComponent } from './Features/system-lookups/components/system-lookups.component';


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


      

      
      
    ]
    
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
