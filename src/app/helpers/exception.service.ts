import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExceptionService {

  constructor() { }

  handle(error){
    console.log(error);
    if (error.name === "UserNotConfirmedException"){
        return 'Your account is not verified.';
    }
  }

}
