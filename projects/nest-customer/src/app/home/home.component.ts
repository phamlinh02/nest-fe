import { AfterViewInit, Component } from '@angular/core';
import { paths } from "../const";
import { OrderService } from "../service/order.service";
import { ProductService } from "../service/product.service";
import { CategoryService } from "../service/category.service";
import { CartService } from '../service/cart.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UploadsService } from '../service/uploads.service';


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
  productImage: { [key: number]: SafeUrl } = {};
  categoryImage: { [key: number]: SafeUrl } = {};

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private router: Router,
    private uploadsService: UploadsService,
    private domSanitizer: DomSanitizer
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

    this.showProductsByCategory();
  }
  showProducts() {
    this.productService.getAllProducts().subscribe((data: any) => {
      this.products = data.response.content;

      this.products.forEach((product, index) => {
        this.getProductImage('product', product.image, index);
      });
      console.log(this.products);
    },
      (error) => {
        console.error('Lỗi khi tải danh sách sản phẩm: ', error);
      });
  }

  getProductImage(type: string, filename: string, index: number) {
    this.uploadsService.getImage(type, filename).subscribe((imageData: Blob) => {
      const imageUrl = URL.createObjectURL(imageData);
      this.productImage[index] = this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
    });
  }

  showCategories() {
    this.categoryService.getAllCategoriesIsActive(0, 100).subscribe((data: any) => {
      this.categories = data.response.content;
      this.categories.forEach((category, index) => {
        this.getAllCategoryImage('category', category.imageCategory,index);
      });
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
        this.showByCategory.forEach((product, index) => {
          this.getProductImage('product', product.image, index);
        });
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

  getAllCategoryImage(type: string, filename: string, index: number) {
    this.uploadsService.getImage(type, filename).subscribe((imageData: Blob) => {
      const imageUrl = URL.createObjectURL(imageData);
      this.categoryImage[index] = this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
    });
  }

}
