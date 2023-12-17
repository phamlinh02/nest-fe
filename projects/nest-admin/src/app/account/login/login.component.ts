import {AfterViewInit, Component} from '@angular/core';
import { AccountService } from '../../service/account.service';
import { Router } from '@angular/router';
import { paths } from '../../const';
import { TokenStorageService } from '../../service/token-storage.service';

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
    private token: TokenStorageService
  ){
  }

  ngAfterViewInit() {
    template.init();
    if (!this.token.isLoggedIn()) {
      document.body.classList.add('not-login');
    }
  }

  login() {
    const payloadLogin = {
      username: this.username,
      password: this.password,
    };

    this.accountService.loginUser(payloadLogin).subscribe(
      data => {
        this.token.saveToken(data.response.token);
        this.token.saveUser(data.response);

        const userString = this.token.getUser();
        if(userString){
          this.userRole = userString.roleName;
        
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
