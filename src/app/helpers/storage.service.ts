import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  storeToken(token){
    return localStorage.setItem('token', token);
}

storeUser(user){
    return localStorage.setItem('username', user);
}

storeUserRoles(roles){
  return localStorage.setItem('roles', roles);
}

Store(user, token,roles){
    this.storeToken(token);
    this.storeUser(user);
    this.storeUserRoles(roles);
}

clear(){
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('roles');
}

getToken(){
    return localStorage.getItem('token')
}

getUser(){
    return localStorage.getItem('username')
}

getRoles(){
  return localStorage.getItem('roles')
}

hasRoles(role){
  //const selectedRole = localStorage.getItem('selected_role');
  if (this.hasAnyRole(role)){
    return true;
  }
  return false;
}

hasAnyRole(role){
  const roles = this.getRoles().split(',');
  // tslint:disable-next-line: prefer-for-of
  for (let i = 0; i < roles.length; i++) {
      if (roles[i] === role){
        return true;
      }
      return false;
  }

}

}
