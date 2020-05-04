import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { timer } from 'rxjs';
import { first } from 'rxjs/operators';
import { LoaderComponent } from 'src/app/common/loader/loader.component';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-verifyuser',
  templateUrl: './verifyuser.component.html',
  styleUrls: ['./verifyuser.component.css']
})
export class VerifyuserComponent implements OnInit {
  @ViewChild(LoaderComponent) child: LoaderComponent;
  showLoader: boolean;

  verificationForm: FormGroup;
  submitted = false;
    errors = '';
    errorDiv = false;
    alert = '';

  constructor(private fb: FormBuilder,
              private router: Router,
              private auth: AuthService) { }

    ngOnInit(): void {
      const verify = localStorage.getItem('verify_user');
      if (verify == null){
        this.router.navigate(['auth/login']);
      }
      this.initForm();
    }

  initForm(){
    const username = localStorage.getItem('register_username');
    this.verificationForm = this.fb.group({
      verify_username: [username, Validators.required],
      code: ['', Validators.required]
    });
  }

  get a() { return this.verificationForm.controls; }

  async verifyUser(){
    this.showLoader = true;
    this.submitted = true;

    const username = this.a.verify_username.value;
    const code = this.a.code.value;

    try {
      await Auth.confirmSignUp(username, code);
      localStorage.removeItem('register_username');
      localStorage.removeItem('verify_user');
      this.showLoader = false;
      this.errorDiv = true;
      this.alert = 'success';
      this.errors = 'Account verified successfully. Redirecting you to login page.';
      setTimeout(() => {
        this.router.navigate(['auth/login']);
      }, 2000);
    } catch (error) {
        this.showLoader = false;
        this.errorDiv = true;
        this.alert = 'danger';
        this.errors = error.message;
        console.log('error confirming sign up', error);

    }

  }

  async verify(){
    const user = await Auth.currentAuthenticatedUser();
    const { attributes } = user;
    Auth.verifyCurrentUserAttribute(attributes)
    .then(() => {
        console.log('a verification code is sent');
    }).catch((e) => {
        console.log('failed with error', e);
    });

  }

}
