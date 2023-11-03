import { Component, AfterViewInit } from '@angular/core';
import { AccountService } from '../service/account.service';
import { Router } from '@angular/router';
import { paths } from '../const';
import { CartService } from '../service/cart.service';


declare const template: any;

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
  accountId: number = 0;
  totalValue: number = 0;
  cartItems: any[] = [];

  constructor(
    private accountService: AccountService,
    private router: Router,
    private cartService: CartService,
  ) { }

  ngAfterViewInit(){
    template.init();
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

        this.cartService.updateCart();
        this.router.navigate(['/home']);
      },
      (error) => {
        this.errorMessage = 'Login unsuccessful. Please check your login information!';
      }
    );
  }
}
