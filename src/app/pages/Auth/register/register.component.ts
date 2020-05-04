import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { timer } from 'rxjs';
import { first } from 'rxjs/operators';
import { LoaderComponent } from 'src/app/common/loader/loader.component';
import Amplify, { Auth, API } from 'aws-amplify';
import awsconfig from '../../../../aws-exports';
Amplify.configure(awsconfig);

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @ViewChild(LoaderComponent) child: LoaderComponent;
  showLoader: boolean;

    regForm: FormGroup;

    loading = false;
    submitted = false;
    errors = '';
    errorDiv = false;
    // tslint:disable-next-line: variable-name
    verify_username = '';
    alert = '';

  constructor(private fb: FormBuilder,
              private router: Router,
              private auth: AuthService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {

    this.regForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      phone_number: ['', Validators.required],
      role: ['0', Validators.required],
      terms_and_conditions: ['', Validators.required]
    });

  }

  get f() { return this.regForm.controls; }


  async onSubmit() {
    this.submitted = true;
    if (this.regForm.invalid) {
      return;
  }
    this.showLoader = true;
    localStorage.setItem('verify_user', '1');

    // tslint:disable-next-line: one-variable-per-declaration
    const username = this.f.username.value,
            email = this.f.email.value,
            password = this.f.password.value,
            // tslint:disable-next-line: variable-name
            phone_number = this.f.phone_number.value,
            role = this.f.role.value;

    try {
            const user = await Auth.signUp({
                username,
                password,
                attributes: {
                    email,
                    phone_number,
                    'custom:role' : role
                }
            });
            console.log({ user });
            // this.addToGroup();
            localStorage.setItem('register_username', username);
            this.showLoader = false;
            this.alert = 'success';
            this.errorDiv = true;
            this.errors = 'Registration successful , Please verify your account.';
            setTimeout(() => {
              this.router.navigate(['auth/verifyuser']);
            }, 2000);
        } catch (error) {
            console.log('error signing up:', error);
            this.showLoader = false;
            this.alert = 'danger';
            this.errorDiv = true;
            this.errors = error.message;
        }


  }


async addToGroup() {
    const apiName = 'AdminQueries';
    const path = '/addUserToGroup';
    const myInit = {
        body: {
          'username' : this.f.username.value,
          'groupname': this.f.role.value
        },
        headers: {
          'Content-Type' : 'application/json',
          //Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
        }
    }
    return await API.post(apiName, path, myInit);
}

}
