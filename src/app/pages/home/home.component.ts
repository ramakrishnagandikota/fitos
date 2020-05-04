import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderComponent } from 'src/app/common/loader/loader.component';
// tslint:disable-next-line: import-spacing
import { StorageService } from  '../../helpers/storage.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from '../../helpers/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild(LoaderComponent) child: LoaderComponent;
  showLoader: boolean;
  userLoggedIn: boolean;

  constructor(private auth: AuthService, private storage: StorageService, private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    this.showLoader = true;
    // tslint:disable-next-line: prefer-const
    let username = this.storage.getUser();
    if (!username){
      this.userLoggedIn = false;
      this.router.navigate(['auth/login']);
    }else{
      setTimeout (() => {
        this.showLoader = false;
     }, 1000);
      this.userLoggedIn = true;
    }
  }

  logOut(){
    this.showLoader = true;
    this.auth.signOut().then(data => {
      console.log(data);
      this.storage.clear();
      this.router.navigate(['auth/login']);
    },
    error => {
      console.log(error);
    });
    //this.router.navigate(['auth/login']);
  }


}
