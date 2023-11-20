import { AfterViewInit, Component } from '@angular/core';
import { ProductService } from '../service/product.service';
import { ActivatedRoute } from '@angular/router';
import { paths } from '../const';
import { CartService } from '../service/cart.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UploadsService } from '../service/uploads.service';

declare let template: any;

@Component({
  selector: 'product-detail',
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent implements AfterViewInit {
  title = 'nest-customer';
  product: any = {};
  productId: number = 1;
  paths = paths;
  accountId: number = 0;
  cartItems: any[] = [];
  quantity: number = 1;
  productImage!: SafeUrl;
  productFile: File | null = null;


  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private router: Router,
    private domSanitizer: DomSanitizer,
    private uploadsService: UploadsService
  ) { }

  ngAfterViewInit() {
   
    this.route.params.subscribe((params) => {
      const id = +params['id'];
      if (!isNaN(id)) {
        this.productId = id;
        this.productService.getProductById(this.productId).subscribe(
          (data: any) => {
            this.product = data.response;
            this.getProductImage('product',this.product.image);
            console.log('Sản phẩm:',this.product);
          },
          (error) => {
            console.error('Lỗi khi tải chi tiết sản phẩm: ', error);
          }
        );
      }
    });
    template.init();
  }

  getProductImage(type: string,filename: string) {
    this.uploadsService.getImage(type,filename).subscribe((imageData: Blob) => {
      const imageUrl = URL.createObjectURL(imageData);
      this.productImage = this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
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
      this.cartService
        .addToCart(this.accountId, productId, this.quantity)
        .subscribe(
          (successResponse) => {
            alert('Sản phẩm đã được thêm vào giỏ hàng');
            console.log('Thêm sản phẩm thành công');
            this.cartItems = this.cartItems.filter((item) => item.id !== productId);
            this.cartService.updateCart();
          },
          (errorResponse) => {
            console.error('Có lỗi khi thêm sản phẩm', errorResponse);
          }
        );
    } else {
      this.router.navigate([`${paths.login}`]);
      alert('Vui lòng đăng nhập để tiếp tục mua sắm !!!');
    }
  }
}