import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { TokenService } from './token.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private storage: StorageService, private token: TokenService) { }

  hasToken(){
    const storedToken = this.storage.getToken();
    if(storedToken){
       return this.token.isValid(storedToken) ? true : this.logout();
    }
    return false;
}

loggedIn(){
  return this.hasToken();
}

logout(){
  this.storage.clear();
}

id(){
  if(this.loggedIn()){
      const payload = this.token.payload(this.storage.getToken());
      return payload.sub;
  }
}

own(id){
  return this.id() == id
}

}
