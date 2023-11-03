import { Component, OnInit } from '@angular/core';
import { AccountService } from '../service/account.service';
import { paths } from '../const';
import { Router } from '@angular/router';
declare const template: any;

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  title = 'nest-customer';
  oldPassword: string = '';
  password: string = '';
  username: string = '';
  errorMessage: string = '';

  constructor(
    private accountService: AccountService,
    private router: Router
  ) {
  }


  ngOnInit() {
    template.init();
    const userDataString = localStorage.getItem('user');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      const username = userData.response.username;
      this.username = username;
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
    // Xóa thông tin người dùng khỏi localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

}
