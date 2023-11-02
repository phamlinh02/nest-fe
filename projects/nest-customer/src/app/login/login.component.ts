import { Component } from '@angular/core';
import { AccountService } from '../service/account.service';
import { Router } from '@angular/router';
import { paths } from '../const';

declare const template : any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  title = 'nest-customer';
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  paths = paths;

  constructor(
    private accountService : AccountService,
    private router : Router
  )
  {}



  login() {
    template.init();
    const payloadLogin = {
      username: this.username,
      password: this.password,
    };

    this.accountService.loginUser(payloadLogin).subscribe(
      (response) => {
        // Đăng nhập thành công, lưu token và thông tin người dùng vào localStorage hoặc session storage
        localStorage.setItem('token', response.accessToken);
        localStorage.setItem('user', JSON.stringify(response));
        // Chuyển hướng đến tsrang chính hoặc trang sau khi đăng nhập
        this.router.navigate(['/home']);
      },
      (error) => {
        // Xử lý lỗi đăng nhập, hiển thị thông báo lỗi
        this.errorMessage = 'Đăng nhập không thành công. Vui lòng kiểm tra thông tin đăng nhập.';
      }
    );
  }
}
