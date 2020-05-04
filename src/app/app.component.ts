import { Component, ViewChild, AfterViewInit, Input } from '@angular/core';
import { Auth } from 'aws-amplify';
import { LoginComponent } from './pages/Auth/login/login.component';
import { StorageService} from './helpers/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FITOS';
  isLoggedIn: false;

  constructor(private storage: StorageService){}

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit() {

  }

}
