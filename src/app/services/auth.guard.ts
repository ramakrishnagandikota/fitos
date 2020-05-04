import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../helpers/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private router: Router, private userService: UserService) {
  }

  /*

  canActivate(
    //next: ActivatedRouteSnapshot,
    //state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
   // return true;

   const token = localStorage.getItem('user');
    if (!token) {
       this.router.navigate(['']);
       return false;
     }
return true;

  }
  */

 canActivate(): boolean {
  const token = this.userService.loggedIn();
  if (token === false) {
     this.router.navigate(['auth/login']);
     return false;
   }
  return true;
 }

}
