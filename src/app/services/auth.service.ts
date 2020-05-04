import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { from } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpClientModule, HttpClient , HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import Amplify, { Auth } from 'aws-amplify';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( private router: Router,
               private http: HttpClient ) {
  // tslint:disable-next-line: no-shadowed-variable
  const httpOptions = {
    headers: new HttpHeaders({
    'Content-Type':  'application/json'
    })
  };
}


  async SignIn(username, password) {
      return await Auth.signIn(username, password);
}

async checkUser(){
/* Auth.currentSession()
    .then(data => {
      return data;
    }).catch (err => {
        console.log(err)
      });
      */
return Auth.currentSession();
}

// tslint:disable-next-line: variable-name
async signUp(username: any, email: any, password: any, phone_number: any, role: any) {
      return await Auth.signUp({
          username,
          password,
          attributes: {
              email,
              phone_number,
              'custom:role' : role
          }
      });

}

async confirmSignUp(username, code) {
  try {
    return await Auth.confirmSignUp(username, code);
  } catch (error) {
      console.log('error confirming sign up', error);
  }
}

async signOut() {
      return await Auth.signOut({ global: true });

}


}
