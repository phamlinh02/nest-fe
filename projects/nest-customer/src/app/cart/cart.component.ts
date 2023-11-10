import { AfterViewInit, Component } from '@angular/core';
import { paths } from '../const';
import { CartService } from '../service/cart.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UploadsService } from '../service/uploads.service';

declare const template: any;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
})
export class CartComponent implements AfterViewInit {
  title = 'nest-customer';
  paths = paths;
  cartItems: any[] = [];
  accountId: number = 0;
  totalValue: number = 0;
  totalPrice: number = 0;
  totalProduct: number = 0;
  productImage: { [key: number]: SafeUrl } = {};

  constructor(
    private cartService: CartService,
    private router: Router,
    private uploadsService: UploadsService,
    private domSanitizer: DomSanitizer
  ) { }
  ngAfterViewInit() {
    template.init();
    const userString = localStorage.getItem('user');
    if (userString) {
      const userData = JSON.parse(userString).response;
      this.accountId = userData.id;
      this.cartService.getAllCarts(this.accountId).subscribe((data: any) => {
        this.cartItems = data.response; // Giả sử dữ liệu trả về có cấu trúc phù hợp
        this.cartItems.forEach((cartItem, index) => {
          this.getProductImage('product', cartItem.productId.image, index);
        });
        this.totalProduct = this.cartItems.length;
        this.totalValue = this.cartItems.reduce((total, item) => total + (item.quantity * item.productId.price), 0);
        this.cartItems = this.cartItems.map((item) => {
          item.totalPrice = item.quantity * item.productId.price;
          return item;
        });
        console.log(this.cartItems, this.totalValue, this.totalPrice, this.totalProduct);
      },
        (error) => {
          console.error('Lỗi khi tải danh sách sản phẩm trong giỏ hàng: ', error);
        });
    }
  }

  removeCartItem(id: number) {
    this.cartService.removeById(id).subscribe(
      response => {
        console.log(`Sản phẩm với id ${id} đã được xóa khỏi giỏ hàng`);
        this.cartItems = this.cartItems.filter(item => item.id !== id);
        this.totalValue = this.cartItems.reduce((total, item) => total + (item.quantity * item.productId.price), 0);
        window.location.reload();
      },
      error => {
        console.error('Đã xảy ra lỗi khi xóa sản phẩm khỏi giỏ hàng', error);
      }
    );
  }

  remove(accountId: number) {
    const userString = localStorage.getItem('user');
    if (userString) {
      const userData = JSON.parse(userString).response;
      this.accountId = userData.id;
      this.cartService.remove(accountId).subscribe(
        response => {
          console.log(`Sản phẩm với id ${accountId} đã được xóa khỏi giỏ hàng`);
          this.totalValue = this.cartItems.reduce((total, item) => total + (item.quantity * item.productId.price), 0);
          this.router.navigate([`${paths.home}`]);
          if (this.cartItems.length === 0) {
            this.cartItems = [];
            this.totalValue = 0;
          }
          window.location.reload();
        },
        error => {
          console.error('Đã xảy ra lỗi khi xóa sản phẩm khỏi giỏ hàng', error);
        }
      );
    }
  }

  updateQuantity(index: number, quantity: number) {
    if (quantity >= 1) {
      this.cartItems[index].quantity = quantity;
      this.updateCart();
      window.location.reload();
    }
  }

  updateCart() {
    const userString = localStorage.getItem('user');
    if (userString) {
      const userData = JSON.parse(userString).response;
      this.accountId = userData.id;
      this.cartService.update(this.accountId, this.cartItems).subscribe(
        successResponse => {
          console.log('Update sản phẩm thành công');
          this.totalValue = this.cartItems.reduce((total, item) => total + (item.quantity * item.productId.price), 0);
          window.location.reload;
        },
        errorResponse => {
          console.error('Có lỗi khi update sản phẩm', errorResponse);
        }
      );
    }
  }
  getProductImage(type: string, filename: string, index: number) {
    this.uploadsService.getImage(type, filename).subscribe((imageData: Blob) => {
      const imageUrl = URL.createObjectURL(imageData);
      this.productImage[index] = this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
    });
  }
}
