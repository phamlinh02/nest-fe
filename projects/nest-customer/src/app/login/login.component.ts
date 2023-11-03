import { Component } from '@angular/core';
import { AccountService } from '../service/account.service';
import { Router } from '@angular/router';
import { paths } from '../const';
import { CartService } from '../service/cart.service';

declare const template: any;

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
  accountId: number = 0;
  totalValue: number = 0;
  cartItems: any[] = [];

  constructor(
    private accountService: AccountService,
    private router: Router,
    private cartService: CartService,
  ) { }

  login() {
    template.init();
    const payloadLogin = {
      username: this.username,
      password: this.password,
    };

    this.accountService.loginUser(payloadLogin).subscribe(
      (response) => {
        localStorage.setItem('token', response.accessToken);
        localStorage.setItem('user', JSON.stringify(response));

        this.showCartItem()
        this.router.navigate(['/home']);
      },
      (error) => {
        this.errorMessage = 'Đăng nhập không thành công. Vui lòng kiểm tra thông tin đăng nhập.';
      }
    );
  }


  showCartItem() {
    const userString = localStorage.getItem('user');
    if (userString) {
      const userData = JSON.parse(userString).response;
      this.accountId = userData.id;
      this.cartService.getAllCarts(this.accountId).subscribe((data: any) => {
        this.cartItems = data.response; // Giả sử dữ liệu trả về có cấu trúc phù hợp
        this.totalValue = this.cartItems.reduce((total, item) => total + (item.quantity * item.productId.price), 0);
        console.log(this.cartItems, this.totalValue);
      },
        (error) => {
          console.error('Lỗi khi tải danh sách sản phẩm trong giỏ hàng: ', error);
        });

    }
  }
}
