import {AfterViewInit, Component} from '@angular/core';
import { AccountService } from '../../service/account.service';
import { Router } from '@angular/router';
import { paths } from '../../const';

declare let template: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements AfterViewInit{
  title = 'nest-customer';
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  paths = paths;
  rememberMe: boolean = false;
  userRole: string = '';


  constructor(
    private accountService: AccountService,
    private router: Router,
  ){
  }

  ngAfterViewInit() {
    template.init();
    if (!this.accountService.isLoggedIn()) {
      document.body.classList.add('not-login');
    }
  }

  login() {
    const payloadLogin = {
      username: this.username,
      password: this.password,
    };

    this.accountService.loginUser(payloadLogin).subscribe(
      (response) => {
        localStorage.setItem('token', response.accessToken);
        localStorage.setItem('user', JSON.stringify(response));
        const userString = localStorage.getItem('user');
        if(userString){
          const userData = JSON.parse(userString).response;
          this.userRole = userData.roleName;
        
        if (this.userRole === 'ROLE_ADMIN' || this.userRole === 'ROLE_DIRECTOR') {
          this.router.navigate(['/home']);
          document.body.classList.remove('not-login');
        } else {
          this.errorMessage = 'Login failed, account does not have access rights!';
        }
      }
      },
      (error) => {
        this.errorMessage = 'Login unsuccessful. Please check your login information!';
      }
    );
  }
}
