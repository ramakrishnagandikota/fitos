import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { timer } from 'rxjs';
import { first } from 'rxjs/operators';
import { LoaderComponent } from 'src/app/common/loader/loader.component';
// tslint:disable-next-line: import-spacing
import { StorageService } from  '../../../helpers/storage.service';
import { TokenService } from '../../../helpers/token.service';
import { UserService } from '../../../helpers/user.service';
import { ExceptionService } from '../../../helpers/exception.service';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild(LoaderComponent) child: LoaderComponent;
  showLoader: boolean;

    loginForm: FormGroup;
    loading = false;
    submitted = false;
    errors = '';
    errorDiv = false;
    userData: [];
    userLoggedIn: boolean;
    userNotVerified: boolean;
    alertMessage = '';
    codeSent: boolean;
    newPassword: boolean;
    alert = '';
    disabled: boolean;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private storage: StorageService,
    private token: TokenService,
    private exception: ExceptionService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    localStorage.removeItem('otp_sent');
    this.checkLoginSession();
    this.initForm();
  }

  initForm() {
      const lusername = localStorage.getItem('login_username');
      const lpassword = localStorage.getItem('login_password');
      const rememberme = localStorage.getItem('login_rememberme');

      this.loginForm = this.fb.group({
      username: [lusername, Validators.required],
      password: [lpassword, Validators.required],
      new_password: [''],
      role: ['0', Validators.required],
      rememberme: [rememberme]
    });
  }

  get f() { return this.loginForm.controls; }

  async onSubmit() {
    this.showLoader = true;
    this.submitted = true;

    if (this.loginForm.invalid) {
        return;
    }
    this.disabled = true;
    // tslint:disable-next-line: one-variable-per-declaration
    const username = this.f.username.value,
          password = this.f.password.value,
          remember = this.f.rememberme.value;
          // tslint:disable-next-line: variable-name
    let new_password = this.f.new_password.value;

    this.removeRememberMe();

    if (remember){
      this.addRememberMe(username, password, remember);
    }

    localStorage.setItem('selected_role', this.f.role.value);

    try {
      const user = await Auth.signIn(username, password);
      console.log('check user challenge', user);
      if (user.challengeName === 'NEW_PASSWORD_REQUIRED'){
        // alert(new_password);
        if (!new_password){
            this.disabled = false;
            this.newPassword = true;
            this.showLoader = false;
            this.alert = 'danger';
            this.errorDiv = true;
            this.errors = 'Please enter new password to continue login.';
            // return false;
        }else{
          this.alert = '';
          this.errorDiv = false;
          this.errors = '';
          this.newPassword = false;

          const { requiredAttributes } = user.challengeParam;
          const loggedUser = await Auth.completeNewPassword(
          user,              // the Cognito User Object
          new_password, {

          }
      ).then(() => {
            this.showLoader = false;
            this.checkLoginSession();
            new_password = '';
    }).catch(e => {
      console.log(e);
      this.disabled = false;
      this.showLoader = false;
      this.alert = 'danger';
      this.errorDiv = true;
      this.errors = e.message;
    });

        }


      }else{
        this.showLoader = false;
        this.checkLoginSession();
      }

  } catch (error) {
      this.disabled = false;
      console.log('error signing in', error);
      if (error.code === 'UserNotConfirmedException'){
          this.userNotVerified = true;
      }else if (error.code === 'UserNotFoundException'){
        this.alert = 'danger';
        this.errorDiv = true;
        this.errors = error.message;
      }else if (error.code === 'PasswordResetRequiredException'){
        this.alert = 'danger';
        this.errorDiv = true;
        this.errors = error.message;
      }else if (error.code === 'NotAuthorizedException'){
        this.alert = 'danger';
        this.errorDiv = true;
        this.errors = error.message;
      }else if (error.code === 'NetworkError'){
        this.alert = 'danger';
        this.errorDiv = true;
        this.errors = 'Please check your internet connection.';
      }else{
        console.log(error);
        this.alert = 'danger';
        this.errorDiv = true;
        this.errors = error.message;
      }
      this.showLoader = false;
  }

  }

  async verifyUser(){
    const username = this.f.username.value;
    localStorage.setItem('verify_user', '1');
    localStorage.setItem('register_username', username);

    try {
      await Auth.resendSignUp(username);
      this.userNotVerified = false;
      this.alertMessage = 'success';
      this.codeSent = true;
      setTimeout(() => {
        this.router.navigate(['auth/verifyuser']);
      }, 2000);
      // console.log('code resent succesfully');
  } catch (err) {
      console.log('error resending code: ', err);
      this.userNotVerified = false;
      this.alertMessage = 'danger';
      this.codeSent = false;
      this.alert = 'danger';
      this.errorDiv = true;
      this.errors = err.message;
      this.disabled = false;
  }

  }



  checkLoginSession(){
    this.auth.checkUser().then(data => {
      if (data){
        console.log('check login session', data);
        // tslint:disable-next-line: no-string-literal
        if (this.token.isValid(data['accessToken'].jwtToken)) {
          // tslint:disable-next-line: max-line-length
          this.storage.Store(data['accessToken'].payload.username, data['accessToken'].jwtToken, data['accessToken'].payload['cognito:groups']);
          const selected = localStorage.getItem('selected_role');
          if (this.storage.hasRoles(selected) === true){
            this.alert = 'success';
            this.errorDiv = true;
            this.errors = 'Login Successful';
            setTimeout(() => {
              this.router.navigate([selected + '/dashboard']);
            }, 1000);

          }else{
          this.disabled = false;
          this.auth.signOut();
          this.storage.clear();
          this.alert = 'danger';
          this.errorDiv = true;
          this.errors = 'The credentials does not support your role.';
          }


         // this.router.navigate(['/']);
        }else{
          this.disabled = false;
          this.auth.signOut();
          this.storage.clear();
          this.errorDiv = true;
          this.errors = 'The login is invalid . logging in again.';
        }

     // }
        // alert(data.accessToken.jwtToken)
       // localStorage.setItem('username', data.accessToken.payload.username);
       // localStorage.setItem('accessToken', data.accessToken.jwtToken);
        // this.router.navigate(['/']);
      }
    },
    error => {
      this.disabled = false;
      console.log('check login session1', error);
    });
  }

  removeRememberMe(){
    localStorage.removeItem('login_username');
    localStorage.removeItem('login_password');
    localStorage.removeItem('login_rememberme');
  }

  addRememberMe(username, password, remember){
      localStorage.setItem('login_username', username);
      localStorage.setItem('login_password', password);
      localStorage.setItem('login_rememberme', remember);
  }
}
