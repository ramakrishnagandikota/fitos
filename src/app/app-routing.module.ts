import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/Auth/login/login.component';
import { RegisterComponent } from './pages/Auth/register/register.component';
import { ForgotpasswordComponent } from './pages/Auth/forgotpassword/forgotpassword.component';
import { HomeComponent } from './pages/home/home.component';
import { VerifyuserComponent } from './pages/Auth/verifyuser/verifyuser.component';
import { AuthGuard } from './services/auth.guard';
import { FEdashboardComponent } from './pages/FashionEntrepreneur/fedashboard/fedashboard.component';
import { TDdashboardComponent } from './pages/TechnicalDesigner/tddashboard/tddashboard.component';

const routes: Routes = [
    { path: '', component: HomeComponent, pathMatch: 'full'},
		{ path: 'auth/login', component : LoginComponent},
    { path: 'auth/register', component : RegisterComponent},
    { path: 'auth/verifyuser', component : VerifyuserComponent},
    { path: 'auth/forgot-password', component : ForgotpasswordComponent},
    { path: 'TechnicalDesigner/dashboard', component: TDdashboardComponent, canActivate: [ AuthGuard]},
    { path: 'FashionEntrepreneur/dashboard', component: FEdashboardComponent, canActivate: [ AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
