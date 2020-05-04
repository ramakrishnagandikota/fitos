import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth.guard';

/* Add Amplify imports */
import { AmplifyUIAngularModule } from '@aws-amplify/ui-angular';
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from '../aws-exports';
/* Add Amplify imports */

import { LoginComponent } from './pages/Auth/login/login.component';
import { RegisterComponent } from './pages/Auth/register/register.component';
import { ForgotpasswordComponent } from './pages/Auth/forgotpassword/forgotpassword.component';
import { HeaderComponent } from './common/header/header.component';
import { LoaderComponent } from './common/loader/loader.component';
import { StorageService } from './helpers/storage.service';
import { HomeComponent } from './pages/home/home.component';
import { TokenService } from './helpers/token.service';
import { UserService } from './helpers/user.service';
import { ExceptionService } from './helpers/exception.service';
import { VerifyuserComponent } from './pages/Auth/verifyuser/verifyuser.component';
import { FEdashboardComponent } from './pages/FashionEntrepreneur/fedashboard/fedashboard.component';
import { TDdashboardComponent } from './pages/TechnicalDesigner/tddashboard/tddashboard.component';

/* Configure Amplify resources */
Amplify.configure(awsconfig);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForgotpasswordComponent,
    HeaderComponent,
    LoaderComponent,
    HomeComponent,
    VerifyuserComponent,
    FEdashboardComponent,
    TDdashboardComponent
  ],
  imports: [
    AmplifyUIAngularModule,
    BrowserModule,
    AppRoutingModule,
	  FormsModule,
    ReactiveFormsModule,
	  HttpClientModule
  ],
  providers: [AuthService, AuthGuard, StorageService, TokenService, UserService, ExceptionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
