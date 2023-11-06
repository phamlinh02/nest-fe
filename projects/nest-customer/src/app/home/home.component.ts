import { AfterViewInit, Component } from '@angular/core';
import { paths } from "../const";
import { OrderService } from "../service/order.service";
import { ProductService } from "../service/product.service";
import { CategoryService } from "../service/category.service";
import { CartService } from '../service/cart.service';
import { Router } from '@angular/router';


declare const template: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements AfterViewInit {
  title = 'nest-customer';
  paths = paths;
  products: any[] = [];
  categories: any[] = [];
  cartItem: any[] = [];
  accountId: number = 0;
  cartItems: any[] = [];
  categoryId: number = 1;
  showByCategory: any[] = [];
  quantity: number = 1;

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private router: Router,
  ) {
  }
  ngAfterViewInit() {
    template.init();

    //Lấy danh sách sản phẩm
    this.showProducts();

    //Lấy danh mục sản phẩm
    this.showCategories();

    this.orderService.getAllOrder({}).subscribe(response => {
      console.log(response);
    });
  }
  showProducts() {
    this.productService.getAllProducts().subscribe((data: any) => {
      this.products = data.response.content;
      console.log(this.products);
    },
      (error) => {
        console.error('Lỗi khi tải danh sách sản phẩm: ', error);
      });
  }

  showCategories() {
    this.categoryService.getAllCategories().subscribe((data: any) => {
      this.categories = data.response.content;
      console.log(this.categories);
    },
      (error) => {
        console.error('Lỗi khi tải danh sách danh mục sản phẩm: ', error);
      });
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  updateQuantity(event: Event): void {
    this.quantity = +(<HTMLInputElement>event.target).value;
  }

  addToCart(productId: number) {
    const userString = localStorage.getItem('user');
    if (userString) {
      const userData = JSON.parse(userString).response;
      this.accountId = userData.id;

      this.cartService.addToCart(this.accountId, productId, this.quantity).subscribe(
        successResponse => {
          // Xử lý khi thành công
          alert('Sản phẩm đã được thêm vào giỏ hàng');
          console.log('Thêm sản phẩm thành công');
          this.cartItems = this.cartItems.filter(item => item.id !== productId);
          this.cartService.updateCart();
          this.quantity = 1;
        },
        errorResponse => {
          // Xử lý khi có lỗi
          console.error('Có lỗi khi thêm sản phẩm', errorResponse);
        }
      );
    } else {
      this.router.navigate([`${paths.login}`]);
      alert('Vui lòng login để tiếp tục mua sắm !!!');
    }
  }

  showProductsByCategory() {
    this.productService.showProductsByCategory(this.categoryId).subscribe(
      (data: any) => {
        this.showByCategory = data.response.content;
      },
      (error) => {
        console.error('Lỗi khi tải chi tiết sản phẩm: ', error);
      }
    );
  }
  changeCategory(newCategoryId: number) {
    this.categoryId = newCategoryId;
    console.log(this.categoryId);
    this.showProductsByCategory(); // Gọi lại phương thức để cập nhật sản phẩm
  }
  
}
