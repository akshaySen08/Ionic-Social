import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  username = '';
  password = '';

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }


  login() {
    const {username, password} = this;
    this.authService.login(username, password).subscribe(
      res => {
        console.log(res);
        
      }
    );
  }
}
