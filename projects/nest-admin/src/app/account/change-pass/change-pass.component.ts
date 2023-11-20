import {AfterViewInit, Component} from '@angular/core';
import { AccountService } from '../../service/account.service';
import { Router } from '@angular/router';
import { paths } from '../../const';

declare let template: any;

@Component({
  selector: 'app-login',
  templateUrl: './change-pass.component.html',
})
export class ChangePasswordComponent implements AfterViewInit{
  title = 'nest-customer';
  oldPassword: string = '';
  password: string = '';
  username: string = '';
  errorMessage: string = '';


  constructor(
    private accountService: AccountService,
    private router: Router,
  ){
  }

  ngAfterViewInit() {
    if (!this.accountService.isLoggedIn()) {
        this.router.navigate(['/login']);
      } else {
        template.init();
        const userDataString = localStorage.getItem('user');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          const username = userData.response.username;
          this.username = username;
        }
      }
    
  }

  changePassword() {
    
    const changePassDTO = {
      username: this.username,
      oldPassword: this.oldPassword,
      password: this.password
    }

    this.accountService.changePassword(changePassDTO).subscribe
      ((response) => {
        console.log('Password changed successfully!', response);
        this.logout();
        this.router.navigate(['/login']);
      },
        (error) => {
          this.errorMessage = 'Password change failed, please check the information again!!!';
        }

      )
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  
}
