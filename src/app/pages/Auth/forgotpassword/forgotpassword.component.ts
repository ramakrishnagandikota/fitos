import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { timer, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { LoaderComponent } from 'src/app/common/loader/loader.component';
// tslint:disable-next-line: import-spacing
import { StorageService } from  '../../../helpers/storage.service';
import { TokenService } from '../../../helpers/token.service';
import { UserService } from '../../../helpers/user.service';
import { ExceptionService } from '../../../helpers/exception.service';
import { Auth } from 'aws-amplify';
import { Pipe, PipeTransform } from '@angular/core';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit, OnDestroy {

  @ViewChild(LoaderComponent) child: LoaderComponent;
  showLoader: boolean;

  countDown: Subscription;
  counter = 60;
  tick = 1000;

  forgotPassword: FormGroup;
  resetPassword: FormGroup;
    submitted = false;
    errors = '';
    errorDiv: boolean;
    password: boolean;
    alert = '';
    disabled: boolean;
    fpassword: boolean = true;

    errors1 = '';
    errorDiv1: boolean;
    alert1 = '';
    readonly: boolean = false;
    codeExpired: boolean = false;

  constructor(private fb: FormBuilder,
              private router: Router,
              private auth: AuthService,
              private storage: StorageService,
              private token: TokenService,
              private exception: ExceptionService,
              private userService: UserService) { }

  ngOnInit(): void {

    const otp = localStorage.getItem('otp_sent');
    const fusername = localStorage.getItem('fusername');
    if (otp === '1'){
      this.fpassword = false;
      this.startCounter();
    }
    this.forgotPassword = this.fb.group({
      username: [fusername, Validators.required]
    });

    this.resetPassword = this.fb.group({
      new_username: [fusername, Validators.required],
      code: ['', Validators.required],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required]
    });

  }

  ngOnDestroy(){
    this.countDown = null;
  }

startCounter(){
  this.countDown = timer(0, this.tick).subscribe(() => --this.counter);
}

  get f() { return this.forgotPassword.controls; }
  get a() { return this.resetPassword.controls; }

  onSubmit(){
    this.showLoader = true;
    this.submitted = true;

    if (this.forgotPassword.invalid) {
        return;
    }
    this.disabled = true;
    const username = this.f.username.value;

    Auth.forgotPassword(username)
    .then(data => {
      this.showLoader = false;
      console.log(data);
      // alert(JSON.stringify(data));
      this.alert = 'success';
      this.errorDiv = true;
      this.errors = 'OTP has sent to mobile number ' + data.CodeDeliveryDetails.Destination;
      this.fpassword = false;

      this.readonly = true;
      localStorage.setItem('otp_sent', '1');
      localStorage.setItem('fusername', username);

      this.startCounter();
    }).catch(err => {
      this.showLoader = false;
      this.disabled = false;
      // console.log(err)
      if (err.code === 'UserNotFoundException'){
          this.alert = 'danger';
          this.errorDiv = true;
          this.errors = 'User not found, Please check the username given.';
      }else{
          this.alert = 'danger';
          this.errorDiv = true;
          this.errors = err.message;
      }
    });
  }


  verifyPasswordSubmit(){
    this.showLoader = true;
    this.submitted = true;

    if (this.resetPassword.invalid) {
        return;
    }
    this.disabled = true;
    const username = this.a.new_username.value;
    const code = this.a.code.value;
    // tslint:disable-next-line: variable-name
    const new_password = this.a.password.value;

    //alert(username + ' - ' + code + ' - ' + new_password);


    Auth.forgotPasswordSubmit(username, code, new_password)
    .then(data => {
      this.showLoader = false;
     // console.log(data);
      this.alert1 = 'success';
      this.errorDiv1 = true;
      this.errors1 = 'Password updated successfully, Please login now .';
      setTimeout(() => {
        this.router.navigate(['auth/login']);
      });
    })
    .catch(err => {
      this.showLoader = false;
      this.disabled = false;
      if (err.code === 'CodeMismatchException'){
          this.alert1 = 'danger';
          this.errorDiv1 = true;
          this.errors1 = err.message;
      }else if (err.code === 'ExpiredCodeException'){
          this.alert1 = 'danger';
          this.errorDiv1 = true;
          // this.errors1 = err.message;
          this.codeExpired = true;
      }else if (err.code === 'LimitExceededException'){
        this.alert1 = 'danger';
        this.errorDiv1 = true;
        this.errors1 = err.message;
        localStorage.removeItem('otp_sent');
        localStorage.removeItem('fusername');
        setTimeout(() => {
            this.router.navigate(['auth/login']);
        }, 2000);
      }else{
          this.alert1 = 'danger';
          this.errorDiv1 = true;
          this.errors1 = err.message;
      }
      console.log(err);
    });


  }

  backtoPage(){
    localStorage.setItem('otp_sent', '0');
    this.fpassword = true;
    //this.onSubmit();
  }

  resendOTP(){
    const username = localStorage.getItem('fusername');
    if (username){
      this.showLoader = true;
      Auth.forgotPassword(username)
      .then(data => {
        this.showLoader = false;
        //console.log(data);
        this.showLoader = false;
        // alert(JSON.stringify(data));
        this.alert1 = 'success';
        this.errorDiv1 = true;
        this.errors1 = 'OTP has sent to mobile number ' + data.CodeDeliveryDetails.Destination;
        this.fpassword = false;

        localStorage.setItem('otp_sent', '1');
        localStorage.setItem('fusername', username);
        this.startCounter();
      }).catch(err => {
        this.alert1 = 'danger';
        this.errorDiv1 = true;
        this.errors1 = err.message;

      });
    }else{
      this.backtoPage();
    }
  }

}



@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {
  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    return (
      ('00' + minutes).slice(-2) +
      ':' +
      ('00' + Math.floor(value - minutes * 60)).slice(-2)
    );
  }
}
