import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  isValid(token){
    const payload = this.payload(token);
    if (payload){
        return payload.iss == "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_IkpniLOQX" ? true : false;
    }
    return false;
}
  payload(token) {
    const payload = token.split('.')[1];
    return this.decode(payload);
  }
  decode(payload) {
    if (this.isBase64(payload)){
      return JSON.parse(atob(payload));
  }
    return false;
  }
  isBase64(str) {
    try{
      // tslint:disable-next-line: triple-equals
      return btoa(atob(str)).replace(/=/g,'') == str;
  }
  catch(err){
      return false;
  }
  }
}
