import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../helpers/user.service';
import { Router } from '@angular/router';
import { LoaderComponent } from 'src/app/common/loader/loader.component';
import { AuthService } from '../../../services/auth.service';
// tslint:disable-next-line: import-spacing
import { StorageService } from  '../../../helpers/storage.service';
import { TokenService } from '../../../helpers/token.service';

@Component({
  selector: 'app-fedashboard',
  templateUrl: './fedashboard.component.html',
  styleUrls: ['./fedashboard.component.css']
})
export class FEdashboardComponent implements OnInit {

  @ViewChild(LoaderComponent) child: LoaderComponent;
  showLoader: boolean;
  userLoggedIn: boolean | void;


  constructor(private userService: UserService,
              private router: Router,
              private storage: StorageService,
              private token: TokenService,
              private auth: AuthService) { }



  ngOnInit(): void {
    this.userLoggedIn = this.userService.loggedIn();
  }

  logOut(){
    this.auth.signOut();
    this.userService.logout();
    this.router.navigate(['auth/login']);
  }

}
