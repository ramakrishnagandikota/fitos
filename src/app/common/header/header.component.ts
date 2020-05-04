import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() public isLoggedIn: boolean;
  showMenu: boolean;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    //const username = localStorage.getItem('userName');
    if (user) {
      this.showMenu = true;
    } else {
      this.showMenu = false;
    }

  }

}
